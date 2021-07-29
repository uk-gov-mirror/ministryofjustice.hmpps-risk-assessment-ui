// @ts-check
const { logger } = require('../../common/logging/logger')
const { removeUrlLevels } = require('../../common/utils/util')
const {
  annotateWithAnswers,
  compileInlineConditionalQuestions,
} = require('../../common/middleware/questionGroups/getHandlers')

const displayAddRow = async (
  { params: { assessmentId, groupId, tableName }, originalUrl, body, errors = {}, errorSummary = null },
  res,
) => {
  try {
    const { questionGroup } = res.locals
    const returnUrl = removeUrlLevels(originalUrl, 2)

    // extract the table questions from the question group
    const thisTable = questionGroup.contents.find(element => element.tableCode === tableName)

    let heading = questionGroup.title || 'Add item'
    let submitText = 'Save item'
    if (tableName === 'children_at_risk_of_serious_harm') {
      heading = 'Add a child'
      submitText = 'Add child'
    }
    res.locals.assessmentUuid = assessmentId

    let questions = annotateWithAnswers(thisTable.contents, {}, body)
    questions = compileInlineConditionalQuestions(questions, errors)

    return res.render(`${__dirname}/index`, {
      bodyAnswers: { ...body },
      assessmentId,
      returnUrl,
      heading,
      submitText,
      groupId,
      questions,
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

module.exports = { displayAddRow }
