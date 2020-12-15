const { logger } = require('../../common/logging/logger')
const { getQuestionGroup, getAnswers } = require('../../common/data/assessmentApi')

const displayQuestionGroup = async ({ params: { assessmentId, groupId, subgroup }, tokens }, res) => {
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
    const questions = annotateWithAnswers(questionGroup.contents[subIndex].contents, answers)

    return res.render(`${__dirname}/index`, {
      assessmentId,
      heading: questionGroup.title,
      subheading: questionGroup.contents[subIndex].title,
      groupId,
      questions,
      last: subIndex + 1 === questionGroup.contents.length,
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

const annotateWithAnswers = (questions, answers) => {
  return questions.map(q => {
    const answer = answers[q.questionId]
    const answerValue = answer ? answer.freeTextAnswer : null
    return Object.assign(q, {
      answer: answerValue,
      answerSchemas: annotateAnswerSchemas(q.answerSchemas, answerValue),
    })
  })
}

const annotateAnswerSchemas = (answerSchemas, answerValue) => {
  if (answerValue === null) return answerSchemas

  return answerSchemas.map(as =>
    Object.assign(as, {
      checked: as.value === answerValue,
      selected: as.value === answerValue,
    }),
  )
}

module.exports = { displayQuestionGroup }
