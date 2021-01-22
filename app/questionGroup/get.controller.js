const nunjucks = require('nunjucks')

const { logger } = require('../../common/logging/logger')
const { getQuestionGroup, getAnswers } = require('../../common/data/assessmentApi')

const displayQuestionGroup = async (
  { params: { assessmentId, groupId, subgroup }, body, errors = {}, errorSummary, tokens },
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

  // remove now unneeded conditional questions
  const unconditionalQuestions = questions.filter(question => {
    return !question.conditional
  })

  // add in rendered conditional question strings to each answer
  return unconditionalQuestions.map(question => {
    const currentQuestion = question
    currentQuestion.answerSchemas = question.answerSchemas.map(schema => {
      if (schema.conditional) {
        let thisError
        const errorString = errors[`id-${conditionalQuestions[schema.conditional].questionId}`]?.text

        if (errorString) {
          thisError = `{text:'${errorString}'}`
        }
        let conditionalQuestionString =
          '{% from "./common/templates/components/question/macro.njk" import renderQuestion %} \n'

        conditionalQuestionString += `{{ renderQuestion(${JSON.stringify(
          conditionalQuestions[schema.conditional],
        )},'','',${thisError}) }}`
        const updatedSchema = schema
        updatedSchema.conditional = {
          html: nunjucks.renderString(conditionalQuestionString).replace(/(\r\n|\n|\r)\s+/gm, ''),
        }

        return updatedSchema
      }

      return schema
    })

    return currentQuestion
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
