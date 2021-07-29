/* eslint-disable no-param-reassign */
const { logger } = require('../../common/logging/logger')
const { displayAddRow } = require('./get.controller')
const { postTableRow } = require('../../common/data/hmppsAssessmentApi')
const { removeUrlLevels } = require('../../common/utils/util')
const { formatValidationErrors } = require('../../common/middleware/questionGroups/postHandlers')

const saveTableRow = async (req, res) => {
  const {
    params: { assessmentId, tableName },
    user,
    originalUrl,
    errors,
    body: answers,
  } = req
  if (errors) {
    return displayAddRow(req, res)
  }

  try {
    const returnUrl = removeUrlLevels(originalUrl, 2)
    const [ok, episode] = await postTableRow(assessmentId, 'current', tableName, { answers }, user?.token, user?.id)

    if (!ok) {
      const [validationErrors, errorSummary] = formatValidationErrors(episode.errors, episode.pageErrors)
      req.errors = validationErrors
      req.errorSummary = errorSummary
      return displayAddRow(req, res)
    }
    return res.redirect(returnUrl)
  } catch (error) {
    logger.error(`Could not save to assessment ${assessmentId}, new table ${tableName}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { saveTableRow }
