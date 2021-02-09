// @ts-check
const nunjucks = require('nunjucks')

const { logger } = require('../../common/logging/logger')
const { getQuestionGroup, getAnswers } = require('../../common/data/assessmentApi')

const displayQuestionGroup = async (
  { params: { assessmentId, groupId, subgroup }, body, errors = {}, errorSummary = null, tokens },
  res,
) => {
  try {
    const questionGroup = await grabQuestionGroup(groupId, tokens)
    const subIndex = Number.parseInt(subgroup, 10)

    if (subIndex >= questionGroup.contents.length) {
      return res.redirect(`/${assessmentId}/assessments`)
    }
    if (questionGroup.groupId !== groupId) {
      return res.redirect(`/${assessmentId}/questionGroup/${questionGroup.groupId}/${subIndex}`)
    }

    const { answers } = await grabAnswers(assessmentId, 'current', tokens)
    let questions = annotateWithAnswers(questionGroup.contents[subIndex].contents, answers, body)
    questions = compileInlineConditionalQuestions(questions, errors)

    return res.render(`${__dirname}/index`, {
      bodyAnswers: { ...body },
      assessmentId,
      heading: questionGroup.title,
      subheading: questionGroup.contents[subIndex].title,
      groupId,
      questions,
      last: subIndex + 1 === questionGroup.contents.length,
      errors,
      errorSummary,
    })
  } catch (error) {
    return res.render('app/error', { error })
  }
}

const grabQuestionGroup = (groupId, tokens) => {
  try {
    return getQuestionGroup(groupId, tokens)
  } catch (error) {
    logger.error(`Could not retrieve question group for ${groupId}, error: ${error}`)
    throw error
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

const annotateWithAnswers = (questions, answers, body) => {
  return questions.map(q => {
    const answer = answers[q.questionId]
    const answerValue = body[`id-${q.questionId}`] || (answer ? answer.freeTextAnswer : null)
    return Object.assign(q, {
      answer: answerValue,
      answerSchemas: annotateAnswerSchemas(q.answerSchemas, answerValue),
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
    const currentQuestion = question
    currentQuestion.answerSchemas = question.answerSchemas.map(schemaLine => {
      const updatedSchemaLine = schemaLine
      if (schemaLine.conditional) {
        const subjectId = schemaLine.conditional
        if (schemaLine.displayInline) {
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
          updatedSchemaLine.attributes = [
            ['data-conditional', `${subjectId}`],
            ['data-aria-controls', `conditional-id-form-${subjectId}`],
            ['aria-expanded', `false`],
          ]
          currentQuestion.isConditional = true
          currentQuestion.attributes = [['data-contains-conditional', 'true']]
        }
        return updatedSchemaLine
      }
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
  if (answerValue === null) {
    return answerSchemas
  }

  return answerSchemas.map(as =>
    Object.assign(as, {
      checked: as.value === answerValue,
      selected: as.value === answerValue,
    }),
  )
}

module.exports = { displayQuestionGroup, grabQuestionGroup }
