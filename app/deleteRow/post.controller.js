/* eslint-disable no-param-reassign */
const { logger } = require('../../common/logging/logger')
const { displayDeleteRow } = require('./get.controller')
const { deleteTableRow } = require('../../common/data/hmppsAssessmentApi')
const { removeUrlLevels } = require('../../common/utils/util')

const removeTableRow = async (req, res) => {
  const {
    params: { assessmentId, tableName, tableRow },
    body: reqBody,
    user,
    originalUrl,
    errors,
  } = req
  if (errors) {
    return displayDeleteRow(req, res)
  }

  try {
    const returnUrl = removeUrlLevels(originalUrl, 3)
    const confirmDelete = reqBody['confirm-delete']

    if (confirmDelete === 'yes') {
      await deleteTableRow(assessmentId, 'current', tableName, tableRow, user?.token, user?.id)
    }
    return res.redirect(returnUrl)
  } catch (error) {
    logger.error(`Could not delete row ${tableRow} from table ${tableName}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { removeTableRow }
