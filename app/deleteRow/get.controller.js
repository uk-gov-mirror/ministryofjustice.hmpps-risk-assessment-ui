// @ts-check
const { logger } = require('../../common/logging/logger')
const { removeUrlLevels } = require('../../common/utils/util')
const { grabAnswers } = require('../../common/middleware/questionGroups/getHandlers')

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

    const thisTable = questionGroup.contents?.find(element => element.tableCode === tableName)

    let thisTableIdentifier
    if (thisTable) {
      thisTableIdentifier = thisTable.contents?.find(element => element.answerType.indexOf('presentation') === -1)
        .questionCode
    } else {
      throw new Error('No table with that name found in question group')
    }

    const { answers } = await grabAnswers(assessmentId, 'current', user?.token, user?.id)

    let rowDescriptor
    if (answers[thisTableIdentifier].length > tableRow) {
      rowDescriptor = answers[thisTableIdentifier][tableRow]
    } else {
      throw new Error('No table data row found')
    }

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
      `Could not retrieve table information for assessment ${assessmentId}, table ${tableName}, row ${tableRow} error: ${error}`,
    )
    return res.render('app/error', { error })
  }
}

module.exports = { displayDeleteRow }
