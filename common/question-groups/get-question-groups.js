// @ts-check
const nunjucks = require('nunjucks')

const annotateWithAnswers = (questions, answers, body) => {
  return questions.map(q => {
    if (q.type === 'group' || q.type === 'table' || q.type === 'TableQuestionDto') {
      // eslint-disable-next-line no-param-reassign
      q.contents = annotateWithAnswers(q.contents, answers, body)
      return q
    }

    let displayAnswer
    let answerValues
    if (q.answerType === 'radio' || q.answerType === 'checkbox') {
      const answer = answers[q.questionId]

      const answerText = []
      answerValues = []
      answer?.forEach(ans => {
        const thisAnswer = q.answerSchemas.find(answerSchema => answerSchema.value === ans)
        answerValues.push(thisAnswer?.value)
        answerText.push(thisAnswer?.text)
      })

      answerValues = body[`id-${q.questionId}`] || answerValues
    } else {
      const answer = answers[q.questionId]

      if (body[`id-${q.questionId}`]) {
        displayAnswer = body[`id-${q.questionId}`]
      } else if (Array.isArray(answer)) {
        displayAnswer = answer.length === 1 ? answer[0] : answer
      } else {
        displayAnswer = null
      }
    }

    return Object.assign(q, {
      answer: displayAnswer,
      answerSchemas: annotateAnswerSchemas(q.answerSchemas, answerValues),
    })
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
        questionObject.formClasses = 'govuk-input--packTogether'
      }
      if (questionObject.conditional) {
        questionObject.formClasses =
          'govuk-radios__conditional govuk-radios__conditional--noIndent govuk-radios__conditional--hidden'
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

module.exports = { compileInlineConditionalQuestions, annotateWithAnswers }
