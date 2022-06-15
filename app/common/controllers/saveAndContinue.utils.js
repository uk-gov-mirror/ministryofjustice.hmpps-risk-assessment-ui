const nunjucks = require('nunjucks')
const { SECTION_INCOMPLETE, SECTION_COMPLETE } = require('../../../common/utils/constants')

const hasAnswerIn = v => Array.isArray(v) && v.length > 0
const hasAnswer = v => v && v.length > 0

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
  const someValueFrom = answer => (hasAnswerIn(answer) ? answer : [])
  const answerFor = questionCode => {
    let answer = ''

    const [submittedAnswer] = someValueFrom(submittedAnswers[questionCode])
    const [previousAnswer = ''] = someValueFrom(previousAnswers[questionCode])

    if (submittedAnswer || submittedAnswer === '') {
      answer = submittedAnswer
    } else {
      answer = previousAnswer
    }

    return answer
  }

  if (fieldProperties.answerType === 'radio') {
    let checkedAnswer = answerFor(fieldName)
    const [selectedAnswer] = fieldProperties.answerDtos.filter(answer => answer.value === checkedAnswer)
    const displayAnswer = selectedAnswer?.text || ''

    if (fieldProperties.questionCode.match(/^\w+_complete$/)) {
      if (checkedAnswer !== SECTION_COMPLETE) {
        checkedAnswer = SECTION_INCOMPLETE
      }
    }
    return {
      ...fieldProperties,
      answer: displayAnswer,
      answerDtos: fieldProperties.answerDtos.map(answer => ({
        ...answer,
        checked: checkedAnswer === answer.value,
      })),
    }
  }

  if (fieldProperties.answerType === 'checkbox') {
    const selected = submittedAnswers[fieldName] || previousAnswers[fieldName] || []
    const displayAnswers = fieldProperties.answerDtos
      .filter(answer => selected.includes(answer.value))
      .map(answer => answer.text)
      .join(', ')

    return {
      ...fieldProperties,
      answer: displayAnswers,
      answerDtos: fieldProperties.answerDtos.map(answer => ({
        ...answer,
        checked: selected.includes(answer.value),
      })),
    }
  }

  if (fieldProperties.answerType === 'dropdown') {
    const checkedAnswer = answerFor(fieldName)
    const [selectedAnswer] = fieldProperties.answerDtos.filter(answer => answer.value === checkedAnswer)
    const displayAnswer = selectedAnswer?.text || ''

    if (!checkedAnswer || checkedAnswer === '') {
      return {
        ...fieldProperties,
        answer: displayAnswer,
        answerDtos: [
          {
            value: '',
            text: 'Select',
            selected: true,
          },
          ...fieldProperties.answerDtos,
        ],
      }
    }

    return {
      ...fieldProperties,
      answer: displayAnswer,
      answerDtos: fieldProperties.answerDtos.map(answer => ({
        ...answer,
        selected: checkedAnswer === answer.value,
      })),
    }
  }

  const answer = answerFor(fieldName)

  return {
    ...fieldProperties,
    answer,
  }
}

const fieldFrom = (localField, questionDto = {}) => {
  const validationRules = [...(localField.validate || [])]

  const combinedSchema = {
    ...questionDto,
    ...localField,
    validate: validationRules,
    answer: '',
  }

  return combinedSchema
}

const keysByQuestionCode = (otherQuestions, currentQuestion) => ({
  ...otherQuestions,
  [currentQuestion.questionCode]: currentQuestion,
})

const answersByQuestionCode = (otherQuestions, currentQuestion) => ({
  ...otherQuestions,
  [currentQuestion.questionCode]: currentQuestion.answer,
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
      !hasAnswer(answers[`${dateKey}-year`]) ||
      !hasAnswer(answers[`${dateKey}-month`]) ||
      !hasAnswer(answers[`${dateKey}-day`])
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

const renderConditionalQuestion = (questions, questionDto, conditionalQuestionCodes, errors, _nunjucks = nunjucks) => {
  const conditionalQuestions = conditionalQuestionCodes.map(({ code, deps }) => {
    const [schema] = questions.filter(question => question.questionCode === code)
    return { schema, deps }
  })

  const answerDtos = questionDto.answerDtos.map(answer => {
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

  return { ...questionDto, answerDtos }
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

module.exports = {
  compileConditionalQuestions,
  getErrorMessage,
  pageValidationErrorsFrom,
  withAnswersFrom,
  keysByQuestionCode,
  combineDateFields,
  combinedLocalFieldsWith,
  answerDtoFrom,
  answersByQuestionCode,
}
