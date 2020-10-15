const { logger } = require('../../common/logging/logger')
const { getQuestionGroup } = require('../../common/data/assessmentApi')

const displayQuestionGroup = async ({ params: { groupId }, tokens }, res) => {
  try {
    const questionGroup = await getQuestionGroup(groupId, tokens)

    return res.render(`${__dirname}/index`, {
      heading: questionGroup.contents[0].title,
      groupId,
      questions: questionGroup.contents[0].contents,
    })
  } catch (error) {
    logger.error(`Could not retrieve question group for ${groupId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { displayQuestionGroup }
