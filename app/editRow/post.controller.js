/* eslint-disable no-param-reassign */
const { logger } = require('../../common/logging/logger')
const { editTableRow } = require('./get.controller')
const { updateEditedTableRow } = require('../../common/data/hmppsAssessmentApi')
const { removeUrlLevels } = require('../../common/utils/util')
const { formatValidationErrors, extractAnswers } = require('../../common/question-groups/post-question-groups')

const updateTableRow = async (req, res) => {
  const {
    params: { assessmentId, tableName, tableRow },
    body: reqBody,
    user,
    originalUrl,
    errors,
  } = req
  if (errors) {
    return editTableRow(req, res)
  }

  try {
    const returnUrl = removeUrlLevels(originalUrl, 3)
    const answers = extractAnswers(reqBody)
    const [ok, episode] = await updateEditedTableRow(
      assessmentId,
      'current',
      tableName,
      tableRow,
      answers,
      user?.token,
      user?.id,
    )

    if (!ok) {
      const [validationErrors, errorSummary] = formatValidationErrors(episode.errors, episode.pageErrors)
      req.errors = validationErrors
      req.errorSummary = errorSummary
      return editTableRow(req, res)
    }
    return res.redirect(returnUrl)
  } catch (error) {
    logger.error(`Could not save to assessment ${assessmentId}, new table ${tableName}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { updateTableRow }
