const { logger } = require('../../common/logging/logger')
const { getQuestionGroup, getAnswers } = require('../../common/data/assessmentApi')

const devAssessmentId = 'e69a61ff-7395-4a12-b434-b1aa6478aded'

const displayQuestionGroup = async ({ params: { groupId }, tokens }, res) => {
  try {
    const questionGroup = await grabQuestionGroup(groupId, tokens)
    const { answers } = await grabAnswers(devAssessmentId, 'current', tokens)

    return res.render(`${__dirname}/index`, {
      heading: questionGroup.contents[0].title,
      groupId,
      questions: questionGroup.contents[0].contents,
      answers,
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

module.exports = { displayQuestionGroup }
