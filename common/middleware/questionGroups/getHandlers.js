// @ts-check
const nunjucks = require('nunjucks')
const { getAnswers } = require('../../data/hmppsAssessmentApi')
const { logger } = require('../../logging/logger')

const whereAnswerSchemaValueIs = value => answerSchema => answerSchema.value === value
const isMultipleChoiceAnswerFor = answerType => answerType === 'radio' || answerType === 'checkbox'
const isPresentationOnlyFor = answerType => typeof answerType === 'string' && answerType.match(/presentation:/gi)
let conditionalQuestionsToRemove = []
const outOfLineConditionalQuestions = []

const annotateWithAnswers = (questions, answers, body) => {
  return questions.map(questionSchema => {
    if (questionSchema.type === 'group') {
      return {
        ...questionSchema,
        contents: annotateWithAnswers(questionSchema.contents, answers, body),
      }
    }

    if (isPresentationOnlyFor(questionSchema.answerType)) {
      return {
        ...questionSchema,
        answer: '',
      }
    }

    if (questionSchema.type === 'table' || questionSchema.type === 'tableGroup') {
      return {
        ...questionSchema,
        contents: annotateWithAnswers(questionSchema.contents, answers, body),
      }
    }

    if (questionSchema.answerType === 'checkboxGroup') {
      const extractedAnswers = questionSchema.answerSchemas.reduce((acc, answerSchema) => {
        const answerInBody = body[`${answerSchema.value}`]
        const storedAnswer = answers[`${answerSchema.value}`]
        const answer = answerInBody || storedAnswer

        if (!answer || !answer.includes('YES')) {
          return acc
        }

        return [...acc, answerSchema.value]
      }, [])

      return {
        ...questionSchema,
        answerSchemas: annotateAnswerSchemas(questionSchema.answerSchemas, extractedAnswers),
      }
    }

    const asArray = v => {
      if (!v) {
        return []
      }

      return Array.isArray(v) ? v : [v]
    }

    let answerValues
    const answerInBody = body[questionSchema.questionId]
    const storedAnswer = answers[questionSchema.questionId]
    const preferredAnswer = answerInBody || storedAnswer
    const answer = asArray(preferredAnswer)

    if (isMultipleChoiceAnswerFor(questionSchema.answerType)) {
      const answerText = []
      answerValues = []
      answer?.forEach(ans => {
        if (Array.isArray(ans)) {
          const thisElementAnswer = []
          ans.forEach(arrayAns => {
            const thisAnswer = questionSchema.answerSchemas.find(whereAnswerSchemaValueIs(arrayAns))
            thisElementAnswer.push(thisAnswer.text)
          })
          answerValues.push(thisElementAnswer)
          answerText.push(thisElementAnswer)
        } else {
          const thisAnswer = questionSchema.answerSchemas.find(whereAnswerSchemaValueIs(ans))
          answerValues.push(thisAnswer?.value)
          answerText.push(thisAnswer?.text)
        }
      })

      return {
        ...questionSchema,
        answerSchemas: annotateAnswerSchemas(questionSchema.answerSchemas, answerInBody || answerValues),
      }
    }

    const [firstAnswer = ''] = answer

    return {
      ...questionSchema,
      answer: firstAnswer,
    }
  })
}

const compileInlineConditionalQuestions = (questions, errors) => {
  // construct an object with all conditional questions, keyed on id
  const conditionalQuestions = {}
  questions.forEach(question => {
    if (question.conditional) {
      const key = question.questionId
      conditionalQuestions[key] = question
    }
  })

  // add in rendered conditional question strings to each answer when displayed inline
  const compiledQuestions = questions.map(question => {
    if (question.type === 'group') {
      // eslint-disable-next-line no-param-reassign
      question.contents = compileInlineConditionalQuestions(question.contents, errors)
      return question
    }
    let currentQuestion = question

    const { updatedSchemas, removeQuestions } = updateAnswerSchemasWithInlineConditionals({
      schemas: question.answerSchemas,
      conditionalQuestionsToRemove,
      questions,
      errors,
      conditionalQuestions,
    })
    currentQuestion.answerSchemas = updatedSchemas
    if (removeQuestions.length) {
      // @ts-ignore
      conditionalQuestionsToRemove = [...new Set(conditionalQuestionsToRemove.concat(removeQuestions))]
    }

    // add appropriate classes to hide questions to be displayed out-of-line
    currentQuestion = updateOutOfLineConditionals(question)
    return currentQuestion
  })

  return compiledQuestions
    .filter(question => {
      // remove questions that have been rendered inline
      return (
        !conditionalQuestionsToRemove.includes(question.questionId) ||
        outOfLineConditionalQuestions.includes(question.questionId)
      )
    })
    .map(question => {
      // add css to hide questions to be displayed out of line
      const questionObject = question
      if (!questionObject.questionText) {
        questionObject.formClasses = 'govuk-input--pack-together'
      }
      if (questionObject.conditional) {
        questionObject.formClasses =
          'govuk-radios__conditional govuk-radios__conditional--no-indent govuk-radios__conditional--hidden'
        questionObject.isConditional = true
        questionObject.attributes = [
          ['data-outofline', 'true'],
          ['data-base-id', `${questionObject.questionId}`],
        ]
      }
      return questionObject
    })
}

// for inline conditional questions, compile their HTML and add to parent question answer schema,
// then mark the original question for deletion
const updateAnswerSchemasWithInlineConditionals = ({
  schemas,
  conditionalQuestionsToRemove: questionsToRemove = [],
  questions,
  errors,
  conditionalQuestions,
}) => {
  let removeQuestions = questionsToRemove
  const updatedSchemas = schemas?.map(schemaLine => {
    const updatedSchemaLine = schemaLine

    schemaLine.conditionals?.forEach(conditionalDisplay => {
      const subjectId = conditionalDisplay.conditional
      if (conditionalDisplay.displayInline) {
        let thisError

        const errorString = errors[`id-${conditionalQuestions[subjectId].questionId}`]?.text

        if (errorString) {
          thisError = `{text:'${errorString}'}`
        }
        let conditionalQuestionString =
          '{% from "./common/templates/components/question/macro.njk" import renderQuestion %} \n'

        const conditionalQuestion = conditionalQuestions[subjectId]

        // do a recursive call to compile inline conditionals for this target question if needed
        const { updatedSchemas: newSchemas, removeQuestions: newRemove } = updateAnswerSchemasWithInlineConditionals({
          schemas: conditionalQuestion.answerSchemas,
          conditionalQuestionsToRemove: removeQuestions,
          questions,
          errors,
          conditionalQuestions,
        })
        conditionalQuestion.answerSchemas = newSchemas
        if (newRemove.length) {
          // @ts-ignore
          removeQuestions = [...new Set(removeQuestions.concat(removeQuestions))]
        }

        const attributesString = JSON.stringify(conditionalQuestion.attributes)

        conditionalQuestionString += `{{ renderQuestion(${JSON.stringify({
          ...conditionalQuestion,
          attributes: attributesString,
        })},'','',${thisError}) }}`

        // this replace seems superfluous but avoids triggering a bug in the nunjucks rendering engine:
        // '(unknown path) [Line 2, Column 668] parseAggregate: expected comma after expression'
        // that space is important!
        conditionalQuestionString = conditionalQuestionString.replace(
          '</div></div></fieldset>\\n</div>"}},',
          '</div></div></fieldset>\\n</div>"} },',
        )

        const newHTML = nunjucks.renderString(conditionalQuestionString).replace(/(\r\n|\n|\r)\s+/gm, '')
        let existingHTML = updatedSchemaLine.conditional?.html || ''
        existingHTML += newHTML.replace(/(\r\n|\n|\r)\s+/gm, '')

        updatedSchemaLine.conditional = { html: existingHTML }

        // mark the target question to be deleted later
        removeQuestions.push(subjectId)
      }
      return updatedSchemaLine
    })
    return schemaLine
  })

  return { updatedSchemas, removeQuestions }
}

const updateOutOfLineConditionals = (question = []) => {
  const currentQuestion = question
  // @ts-ignore
  currentQuestion.answerSchemas = currentQuestion.answerSchemas?.map(schemaLine => {
    const updatedSchemaLine = schemaLine
    const outOfLineConditionalsForThisAnswer = []

    schemaLine.conditionals?.forEach(conditionalDisplay => {
      const subjectId = conditionalDisplay.conditional
      if (!conditionalDisplay.displayInline) {
        outOfLineConditionalsForThisAnswer.push(subjectId)
      }

      if (outOfLineConditionalsForThisAnswer?.length) {
        const pre = 'conditional-id-form-'
        const ariaControls = outOfLineConditionalsForThisAnswer.map(i => pre + i).join(' ')
        updatedSchemaLine.attributes = [
          ['data-conditional', outOfLineConditionalsForThisAnswer.join(' ')],
          ['data-aria-controls', ariaControls],
          ['aria-expanded', `false`],
        ]
        // @ts-ignore
        currentQuestion.isConditional = true
        // @ts-ignore
        currentQuestion.attributes = [['data-contains-conditional', 'true']]
      }
      return updatedSchemaLine
    })
    return schemaLine
  })
  return currentQuestion
}

const annotateAnswerSchemas = (answerSchemas, answerValue) => {
  if (!answerValue || answerValue?.length === 0) {
    return answerSchemas
  }
  return answerSchemas.map(as => {
    return Object.assign(as, {
      checked: as.value === answerValue || answerValue.includes(as.value),
      selected: as.value === answerValue || answerValue.includes(as.value),
    })
  })
}

const grabAnswers = (assessmentId, episodeId, token, userId) => {
  try {
    return getAnswers(assessmentId, episodeId, token, userId)
  } catch (error) {
    logger.error(`Could not retrieve answers for assessment ${assessmentId} episode ${episodeId}, error: ${error}`)
    throw error
  }
}

module.exports = { compileInlineConditionalQuestions, annotateWithAnswers, grabAnswers }
