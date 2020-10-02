const { logger } = require('../../common/logging/logger')
const { getQuestionGroup } = require('../../common/data/assessmentApi')

const displayQuestionGroup = async ({ params: { groupId }, tokens }, res) => {
  try {
    const questions = await getQuestionGroup(groupId, tokens)
    return res.render(`${__dirname}/index`, { questions, groupId })
  } catch (error) {
    logger.error(`Could not retrieve question group for ${groupId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { displayQuestionGroup }
