// @ts-check
const { logger } = require('../../common/logging/logger')
const { removeUrlLevels } = require('../../common/utils/util')
const { getAnswers } = require('../../common/data/hmppsAssessmentApi')

const displayDeleteRow = async (
  { params: { assessmentId, groupId, tableName, tableRow }, originalUrl, body, errors = {}, errorSummary = null, user },
  res,
) => {
  try {
    const { questionGroup } = res.locals
    const returnUrl = removeUrlLevels(originalUrl, 3)

    // extract the table questions from the question group
    // get table with this table code then find the first question within that group
    // with an answerType which is not presentational
    const thisTableIdentifier = questionGroup.contents
      .find(element => element.tableCode === tableName)
      .contents.find(element => element.answerType.indexOf('presentation') === -1).questionId

    const { answers } = await grabAnswers(assessmentId, 'current', user?.token, user?.id)

    const rowDescriptor = answers[thisTableIdentifier][tableRow]

    let submitText = 'Delete item'
    if (tableName === 'children_at_risk_of_serious_harm') {
      submitText = 'Delete child'
    }
    res.locals.assessmentUuid = assessmentId

    return res.render(`${__dirname}/index`, {
      bodyAnswers: { ...body },
      rowDescriptor,
      assessmentId,
      returnUrl,
      submitText,
      groupId,
      errors,
      errorSummary,
    })
  } catch (error) {
    logger.error(
      `Could not retrieve new table information for assessment ${assessmentId}, table ${tableName}, error: ${error}`,
    )
    return res.render('app/error', { error })
  }
}

const grabAnswers = (assessmentId, episodeId, token, userId) => {
  try {
    return getAnswers(assessmentId, episodeId, token, userId)
  } catch (error) {
    logger.error(`Could not retrieve answers for assessment ${assessmentId} episode ${episodeId}, error: ${error}`)
    throw error
  }
}

module.exports = { displayDeleteRow }
