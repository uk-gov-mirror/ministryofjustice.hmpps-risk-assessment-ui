// @ts-check
const nunjucks = require('nunjucks')
const { logger } = require('../../common/logging/logger')
const { getAnswers } = require('../../common/data/assessmentApi')

const displayQuestionGroup = async (
  { params: { assessmentId, groupId, subgroup }, body, errors = {}, errorSummary = null, tokens },
  res,
) => {
  try {
    const { questionGroup } = res.locals
    const subIndex = Number.parseInt(subgroup, 10)

    const { answers } = await grabAnswers(assessmentId, 'current', tokens)
    let questions = annotateWithAnswers(questionGroup.contents, answers, body)
    questions = compileInlineConditionalQuestions(questions, errors)
    questions = copyUUIDtoValue(questions)

    return res.render(`${__dirname}/index`, {
      bodyAnswers: { ...body },
      assessmentId,
      heading: questionGroup.title,
      subheading: questionGroup.contents[subIndex].title,
      groupId,
      questions,
      errors,
      errorSummary,
    })
  } catch (error) {
    return res.render('app/error', { error })
  }
}

const grabAnswers = (assessmentId, episodeId, tokens) => {
  try {
    return getAnswers(assessmentId, episodeId, tokens)
  } catch (error) {
    logger.error(`Could not retrieve answers for assessment ${assessmentId} episode ${episodeId}, error: ${error}`)
    throw error
  }
}

// copy answer UUID into value as we need this when sending answers back to assessment API
const copyUUIDtoValue = questions => {
  return questions.map(q => {
    q.answerSchemas.map(schema => {
      // eslint-disable-next-line no-param-reassign
      schema.value = schema.answerSchemaUuid
      return schema
    })
    return q
  })
}

const annotateWithAnswers = (questions, answers, body) => {
  return questions.map(q => {
    if (q.type === 'group') {
      // eslint-disable-next-line no-param-reassign
      q.contents = annotateWithAnswers(q.contents, answers, body)
      return q
    }

    let displayAnswer
    let answerValues
    if (q.answerType === 'radio' || q.answerType === 'checkbox') {
      const answer = answers[q.questionId]?.answers

      if (answer) {
        const answerText = []
        answerValues = []
        Object.keys(answer).forEach(ans => {
          const thisAnswer = q.answerSchemas.find(answerSchema => answerSchema.answerSchemaUuid === ans)
          answerValues.push(thisAnswer?.value)
          answerText.push(thisAnswer?.text)
          displayAnswer = answerText.join('<br>')
        })
      }
      answerValues = body[`id-${q.questionId}`] || answerValues
    } else {
      const answer = answers[q.questionId]
      displayAnswer = body[`id-${q.questionId}`] || (answer ? answer.freeTextAnswer : null)
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
    currentQuestion.answerSchemas = question.answerSchemas.map(schemaLine => {
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

          conditionalQuestionString += `{{ renderQuestion(${JSON.stringify(
            conditionalQuestions[subjectId],
          )},'','',${thisError}) }}`

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
  if (!answerValue) {
    return answerSchemas
  }
  return answerSchemas.map(as => {
    return Object.assign(as, {
      checked: as.value === answerValue || answerValue.includes(as.value),
      selected: as.value === answerValue || answerValue.includes(as.value),
    })
  })
}

module.exports = { displayQuestionGroup }
