const nunjucks = require('nunjucks')

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
      answer = previousAnswer.join('\n')
    }

    return answer
  }

  if (fieldProperties.answerType === 'radio') {
    const checkedAnswer = answerFor(fieldName)
    const [selectedAnswer] = fieldProperties.answerSchemas.filter(answerSchema => answerSchema.value === checkedAnswer)
    const displayAnswer = selectedAnswer?.text || ''
    return {
      ...fieldProperties,
      answer: displayAnswer,
      answerSchemas: fieldProperties.answerSchemas.map(answerSchema => ({
        ...answerSchema,
        checked: checkedAnswer === answerSchema.value,
      })),
    }
  }

  if (fieldProperties.answerType === 'checkbox') {
    const selected = submittedAnswers[fieldName] || previousAnswers[fieldName] || []
    const displayAnswers = fieldProperties.answerSchemas
      .filter(answerSchema => selected.includes(answerSchema.value))
      .map(answerSchema => answerSchema.text)
      .join(', ')

    return {
      ...fieldProperties,
      answer: displayAnswers,
      answerSchemas: fieldProperties.answerSchemas.map(answerSchema => ({
        ...answerSchema,
        checked: selected.includes(answerSchema.value),
      })),
    }
  }

  if (fieldProperties.answerType === 'dropdown') {
    const checkedAnswer = answerFor(fieldName)
    const [selectedAnswer] = fieldProperties.answerSchemas.filter(answerSchema => answerSchema.value === checkedAnswer)
    const displayAnswer = selectedAnswer?.text || ''

    if (!checkedAnswer || checkedAnswer === '') {
      return {
        ...fieldProperties,
        answer: displayAnswer,
        answerSchemas: [
          {
            value: '',
            text: 'Select',
            disabled: true,
            selected: true,
            attributes: { hidden: true },
          },
          ...fieldProperties.answerSchemas,
        ],
      }
    }

    return {
      ...fieldProperties,
      answer: displayAnswer,
      answerSchemas: fieldProperties.answerSchemas.map(answerSchema => ({
        ...answerSchema,
        selected: checkedAnswer === answerSchema.value,
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
  const validationRules = [...(localField.validate || [])]
  if (
    questionSchemaDto.mandatory &&
    localField.validate?.filter(validationRule => validationRule.type === 'required').length === 0
  ) {
    const remoteValidationRules = questionSchemaDto.validation ? JSON.parse(questionSchemaDto.validation) : {}
    const { mandatory = {} } = remoteValidationRules
    validationRules.push({
      type: 'required',
      message: mandatory.errorMessage || `[PLACEHOLDER] ${questionSchemaDto.questionText} is mandatory`,
    })
  }

  const combinedSchema = {
    ...questionSchemaDto,
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
