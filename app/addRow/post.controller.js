/* eslint-disable no-param-reassign */
const { logger } = require('../../common/logging/logger')
const { displayAddRow } = require('./get.controller')
const { postTableRow } = require('../../common/data/hmppsAssessmentApi')
const { removeUrlLevels } = require('../../common/utils/util')
const { formatValidationErrors, extractAnswers } = require('../../common/question-groups/post-question-groups')

const saveTableRow = async (req, res) => {
  const {
    params: { assessmentId, tableName },
    body: reqBody,
    tokens,
    originalUrl,
    errors,
  } = req
  if (errors) {
    return displayAddRow(req, res)
  }

  try {
    const returnUrl = removeUrlLevels(originalUrl, 2)
    const answers = extractAnswers(reqBody)
    const [ok, episode] = await postTableRow(assessmentId, 'current', tableName, answers, tokens)

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
