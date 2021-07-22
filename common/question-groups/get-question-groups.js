// @ts-check
const nunjucks = require('nunjucks')
const { getAnswers } = require('../data/hmppsAssessmentApi')
const { logger } = require('../logging/logger')

const whereAnswerSchemaValueIs = value => answerSchema => answerSchema.value === value
const isMultipleChoiceAnswerFor = answerType => answerType === 'radio' || answerType === 'checkbox'
const isPresentationOnlyFor = answerType => typeof answerType === 'string' && answerType.match(/presentation:/gi)

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

    let displayAnswer
    let answerValues
    const answerInBody = body[`id-${questionSchema.questionId}`]
    const answer = answers[questionSchema.questionId] || []

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
          displayAnswer = answerValues
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
    if (answerInBody) {
      displayAnswer = answerInBody
    } else {
      const [firstAnswer = ''] = answer
      displayAnswer = firstAnswer
    }

    return {
      ...questionSchema,
      answer: displayAnswer,
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

  const conditionalQuestionsToRemove = []
  const outOfLineConditionalQuestions = []

  // add in rendered conditional question strings to each answer when displayed inline
  // add appropriate classes to hide questions to be displayed out-of-line
  const compiledQuestions = questions.map(question => {
    if (question.type === 'group') {
      // eslint-disable-next-line no-param-reassign
      question.contents = compileInlineConditionalQuestions(question.contents, errors)
      return question
    }
    const currentQuestion = question
    currentQuestion.answerSchemas = question.answerSchemas?.map(schemaLine => {
      const updatedSchemaLine = schemaLine
      const outOfLineConditionalsForThisAnswer = []

      schemaLine.conditionals?.forEach(conditionalDisplay => {
        const subjectId = conditionalDisplay.conditional
        if (conditionalDisplay.displayInline) {
          // if to be displayed inline then compile HTML string and add to parent question answer
          let thisError

          const errorString = errors[`id-${conditionalQuestions[subjectId].questionId}`]?.text

          if (errorString) {
            thisError = `{text:'${errorString}'}`
          }
          let conditionalQuestionString =
            '{% from "./common/templates/components/question/macro.njk" import renderQuestion %} \n'

          const conditionalQuestion = conditionalQuestions[subjectId]
          const attributesString = JSON.stringify(conditionalQuestion.attributes)

          conditionalQuestionString += `{{ renderQuestion(${JSON.stringify({
            ...conditionalQuestion,
            attributes: attributesString,
          })},'','',${thisError}) }}`

          updatedSchemaLine.conditional = {
            html: nunjucks.renderString(conditionalQuestionString).replace(/(\r\n|\n|\r)\s+/gm, ''),
          }

          // mark the target question to be deleted later
          conditionalQuestionsToRemove.push(subjectId)
        } else {
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
          currentQuestion.isConditional = true
          currentQuestion.attributes = [['data-contains-conditional', 'true']]
        }

        return updatedSchemaLine
      })
      return schemaLine
    })
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
