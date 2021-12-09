const { Controller } = require('hmpo-form-wizard')
const nunjucks = require('nunjucks')
const { getAnswers, postAnswers, getFlatAssessmentQuestions } = require('../../../common/data/hmppsAssessmentApi')
const { logger } = require('../../../common/logging/logger')
const { customValidations } = require('../fields')
const { processReplacements } = require('../../../common/utils/util')

const nullOrEmpty = s => !s || s === ''

const getErrorMessage = reason => {
  if (reason === 'OASYS_PERMISSION') {
    return 'You do not have permission to update this type of assessment. Speak to your manager and ask them to request a change to your level of authorisation.'
  }

  return 'Something went wrong'
}

const pageValidationErrorsFrom = (validationErrors, serverErrors = []) => {
  const errors = Object.values(validationErrors).reduce(
    (otherErrors, currentError) => ({
      validationErrors: { ...otherErrors.validationErrors, [currentError.key]: { text: currentError.message } },
      errorSummary: [
        ...otherErrors.errorSummary,
        {
          text: currentError.message,
          href: `#${[currentError.key]}-error`,
        },
      ],
    }),
    { validationErrors: {}, errorSummary: [] },
  )

  const processedServerErrors = serverErrors.map(errorMessage => ({
    text: errorMessage,
    href: `#`,
  }))

  return {
    validationErrors: errors.validationErrors,
    errorSummary: [...processedServerErrors, ...errors.errorSummary],
  }
}

const withAnswersFrom = (previousAnswers, submittedAnswers) => ([fieldName, fieldProperties]) => {
  const someValueFrom = x => (!nullOrEmpty(x) ? x : undefined)
  const answerFor = f => {
    let answer = ''

    const submittedAnswer = someValueFrom(submittedAnswers[f])
    const previousAnswer = someValueFrom(previousAnswers[f])

    if (submittedAnswer) {
      answer = submittedAnswer
    } else if (Array.isArray(previousAnswer) && previousAnswer.length > 0) {
      const [firstAnswer] = previousAnswer
      answer = firstAnswer
    }

    return answer
  }

  if (fieldProperties.answerType === 'radio') {
    const checkedAnswer = answerFor(fieldName)
    return {
      ...fieldProperties,
      answerSchemas: fieldProperties.answerSchemas.map(answerSchema => ({
        ...answerSchema,
        checked: checkedAnswer === answerSchema.value,
      })),
    }
  }

  if (fieldProperties.answerType === 'checkbox') {
    const selected = submittedAnswers[fieldName] || previousAnswers[fieldName] || []
    return {
      ...fieldProperties,
      answerSchemas: fieldProperties.answerSchemas.map(answerSchema => ({
        ...answerSchema,
        selected: selected.includes(answerSchema.value),
      })),
    }
  }

  const answer = answerFor(fieldName)

  return {
    ...fieldProperties,
    answer,
  }
}

const fieldFrom = (localField, questionSchemaDto = {}) => {
  const validationRules = [...localField.validate]
  if (
    questionSchemaDto.mandatory &&
    localField.validate.filter(validationRule => validationRule.type === 'required').length === 0
  ) {
    const remoteValidationRules = questionSchemaDto.validation ? JSON.parse(questionSchemaDto.validation) : {}
    const { mandatory = {} } = remoteValidationRules
    validationRules.push({
      type: 'required',
      message: mandatory.errorMessage || `[PLACEHOLDER] ${questionSchemaDto.questionText} is mandatory`,
    })
  }

  return {
    conditional: questionSchemaDto.conditional || false,
    readOnly: questionSchemaDto.readOnly || false,
    questionCode: questionSchemaDto.questionCode,
    questionText: questionSchemaDto.questionText,
    helpText: questionSchemaDto.helpText,
    referenceDataTargets: questionSchemaDto.referenceDataTargets,
    answerType: questionSchemaDto.answerType,
    answerSchemas: questionSchemaDto.answerSchemas,
    validate: validationRules,
    dependent: localField.dependent,
    answer: '',
  }
}

const keysByQuestionCode = (otherQuestions, currentQuestion) => ({
  ...otherQuestions,
  [currentQuestion.questionCode]: currentQuestion,
})

const combinedLocalFieldsWith = remoteQuestions => (otherFields, [questionCode, localQuestion]) => ({
  ...otherFields,
  [questionCode]: fieldFrom(localQuestion, remoteQuestions[questionCode]),
})

const combineDateFields = (formValues = {}) => {
  const dateFieldPattern = /-(day|month|year)$/
  const whereDateField = key => dateFieldPattern.test(key)

  const dateFieldNames = Object.keys(formValues).filter(whereDateField)
  const nonDateFieldNames = Object.keys(formValues).filter(fieldName => !whereDateField(fieldName))

  const combinedDateFieldsFor = answers => (otherFields, fieldName) => {
    const dateKey = fieldName.replace(dateFieldPattern, '')

    if (
      nullOrEmpty(answers[`${dateKey}-year`]) ||
      nullOrEmpty(answers[`${dateKey}-month`]) ||
      nullOrEmpty(answers[`${dateKey}-day`])
    ) {
      return { ...otherFields, [dateKey]: '' }
    }

    const year = answers[`${dateKey}-year`]
    const month = answers[`${dateKey}-month`].toString().padStart(2, '0')
    const day = answers[`${dateKey}-day`].toString().padStart(2, '0')

    return { ...otherFields, [dateKey]: `${year}-${month}-${day}` }
  }

  const answersFrom = answers => (otherFields, fieldName) => ({ ...otherFields, [fieldName]: answers[fieldName] })

  const combinedDateFields = dateFieldNames.reduce(combinedDateFieldsFor(formValues), {})
  return nonDateFieldNames.reduce(answersFrom(formValues), combinedDateFields)
}

const answerDtoFrom = formValues =>
  Object.keys(formValues).reduce((otherFields, fieldName) => {
    const answer = formValues[fieldName] !== '' ? formValues[fieldName] : []
    const answerAsArray = Array.isArray(answer) ? answer : [answer]
    return {
      ...otherFields,
      [fieldName]: answerAsArray,
    }
  }, {})

const renderConditionalQuestion = (
  questions,
  questionSchema,
  conditionalQuestionCodes,
  errors,
  _nunjucks = nunjucks,
) => {
  const conditionalQuestions = conditionalQuestionCodes.map(({ code, deps }) => {
    const [schema] = questions.filter(question => question.questionCode === code)
    return { schema, deps }
  })

  const answerSchemas = questionSchema.answerSchemas.map(answer => {
    const questionsDependentOnThisAnswer = conditionalQuestions.filter(
      question => question.schema.dependent.value === answer.value,
    )

    if (questionsDependentOnThisAnswer.length === 0) {
      return answer
    }

    const rendered = questionsDependentOnThisAnswer.reduce((previouslyRendered, conditionalQuestion) => {
      let conditionalQuestionSchema = conditionalQuestion.schema
      if (Array.isArray(conditionalQuestion.deps) && conditionalQuestion.deps.length > 0) {
        conditionalQuestionSchema = renderConditionalQuestion(
          questions,
          conditionalQuestionSchema,
          conditionalQuestion.deps,
          errors,
        )
      }

      const validationError = errors[conditionalQuestionSchema.questionCode]

      const questionString = JSON.stringify(conditionalQuestionSchema)
        .replace('{{', '{ {') // Prevent nunjucks mistaking the braces when rendering the template
        .replace('}}', '} }')

      const errorString = validationError ? `, ${JSON.stringify(validationError)}` : ''

      const conditionalQuestionString =
        '{% from "common/templates/components/question/macro.njk" import renderQuestion %} \n' +
        `{{ renderQuestion(${questionString}, "", ""${errorString}) }}`

      const renderedQuestion = _nunjucks.renderString(conditionalQuestionString).replace(/(\r\n|\n|\r)\s+/gm, '')

      return [previouslyRendered, renderedQuestion].join('')
    }, '')
    return { ...answer, conditional: { html: rendered } }
  })

  return { ...questionSchema, answerSchemas }
}

const compileConditionalQuestions = (questions, errors) => {
  const inlineConditionalQuestions = questions.filter(
    question => question.dependent && !question.dependent.displayOutOfLine,
  )

  const questionCodes = inlineConditionalQuestions.map(question => question.questionCode)

  const rootConditionalQuestions = inlineConditionalQuestions
    .filter(question => !questionCodes.includes(question.dependent.field))
    .reduce(
      (otherQuestions, currentQuestion) => [
        ...otherQuestions,
        ...(otherQuestions.includes(currentQuestion.dependent.field) ? [] : [currentQuestion.dependent.field]),
      ],
      [],
    )

  const buildNode = parentQuestionCode =>
    inlineConditionalQuestions
      .filter(question => question.dependent.field === parentQuestionCode)
      .map(question => {
        const dependents = inlineConditionalQuestions.filter(
          otherQuestion => question.questionCode === otherQuestion.dependent.field,
        )
        if (dependents.length > 0) {
          return { code: question.questionCode, deps: buildNode(question.questionCode) }
        }
        return { code: question.questionCode }
      })

  const dependencyTree = rootConditionalQuestions.map(questionCode => {
    return { code: questionCode, deps: buildNode(questionCode) }
  })

  return dependencyTree.reduce(
    (otherQuestions, { code: questionCode, deps: conditionalQuestionCodes }) => {
      const [questionSchema] = otherQuestions.filter(question => question.questionCode === questionCode)

      const updatedQuestion = renderConditionalQuestion(
        otherQuestions,
        questionSchema,
        conditionalQuestionCodes,
        errors,
      )
      return otherQuestions.map(question =>
        question.questionCode === updatedQuestion.questionCode ? updatedQuestion : question,
      )
    },
    [...questions],
  )
}

class SaveAndContinue extends Controller {
  async locals(req, res, next) {
    res.locals.csrfToken = res.locals['csrf-token']
    delete res.locals['csrf-token']

    res.locals.assessment = req.session.assessment || {}

    const errors = req.sessionModel.get('errors') || {}
    const { validationErrors, errorSummary } = pageValidationErrorsFrom(errors)
    res.locals.errors = validationErrors
    res.locals.errorSummary = errorSummary

    const { answers: previousAnswers } = await getAnswers(
      req.session.assessment?.uuid,
      req.session.assessment?.episodeUuid,
      req.user?.token,
      req.user?.id,
    )
    const submittedAnswers = req.sessionModel.get('answers') || {}

    const questions = Object.entries(req.form.options.fields)
    const questionsWithMappedAnswers = questions.map(withAnswersFrom(previousAnswers, submittedAnswers))
    const questionWithPreCompiledConditionals = compileConditionalQuestions(
      questionsWithMappedAnswers,
      validationErrors,
    )

    const questionsWithReplacements = processReplacements(
      questionWithPreCompiledConditionals,
      req.session?.assessment?.subject,
    )

    res.locals.questions = questionsWithReplacements.reduce(keysByQuestionCode, {})

    super.locals(req, res, next)
  }

  // POST steps
  async configure(req, res, next) {
    const combineLocalAndRemoteFields = (fields, remoteFields) =>
      Object.entries(fields).reduce(combinedLocalFieldsWith(remoteFields), {})

    const questions = await getFlatAssessmentQuestions('RSR', req.user?.token, req.user?.id)
    const questionMap = questions.reduce(keysByQuestionCode, {})
    req.form.options.allFields = combineLocalAndRemoteFields(req.form.options.allFields, questionMap)
    req.form.options.fields = combineLocalAndRemoteFields(req.form.options.fields, questionMap)

    super.configure(req, res, next)
  }

  async process(req, res, next) {
    const withValuesFrom = (answers, fields) => (otherAnswers, currentField) => {
      const dependency = fields[currentField]?.dependent
      let answer = answers[currentField] || ''

      if (dependency && otherAnswers[dependency.field] !== dependency.value) {
        answer = ''
      }

      return {
        ...otherAnswers,
        [currentField]: answer,
      }
    }
    const filterAnswersByFields = (fields, answers) => Object.keys(fields).reduce(withValuesFrom(answers, fields), {})

    const requestBody = req.body || {}
    const answersWithFormattedDates = combineDateFields(requestBody)
    req.form.values = filterAnswersByFields(req.form?.options?.fields, answersWithFormattedDates)
    req.sessionModel.set('answers', req.form?.values || {})
    super.process(req, res, next)
  }

  async validateFields(req, res, next) {
    // at this point makes changes to sessionModel fields to add in context specific validations
    const answers = req.sessionModel.get('answers') || {}
    const { date_first_sanction = '', total_sanctions = '' } = answers
    const offenderDob = req.session?.assessment?.subject?.dob

    req.form.options.fields = customValidations(
      req.form.options.fields,
      offenderDob,
      date_first_sanction,
      total_sanctions,
    )

    super.validateFields(req, res, next)
  }

  async saveValues(req, res, next) {
    const { user } = req
    const answers = answerDtoFrom(req.sessionModel.get('answers'))

    try {
      const [ok, response] = await postAnswers(
        req.session?.assessment?.uuid,
        req.session.assessment?.episodeUuid,
        { answers },
        user?.token,
        user?.id,
      )

      if (ok) {
        return super.saveValues(req, res, next)
      }
      // errors returned from OASys
      if (response.status === 422) {
        const { validationErrors, errorSummary } = pageValidationErrorsFrom(response.errors, response.pageErrors)
        req.errors = validationErrors
        req.errorSummary = errorSummary
        // todo: add OASys errors to page and redisplay
      }
      return res.render('app/error', { subHeading: getErrorMessage(response.reason) })
    } catch (error) {
      logger.error(`Could not save to assessment ${req.session?.assessment?.uuid}, current episode, error: ${error}`)
      return res.render('app/error', { error })
    }
  }
}

module.exports = SaveAndContinue
