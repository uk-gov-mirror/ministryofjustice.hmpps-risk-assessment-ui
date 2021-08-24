// @ts-check
const { logger } = require('../../common/logging/logger')
const { removeUrlLevels } = require('../../common/utils/util')
const {
  annotateWithAnswers,
  compileInlineConditionalQuestions,
  grabAnswers,
} = require('../../common/middleware/questionGroups/getHandlers')

const editTableRow = async (
  { params: { assessmentId, groupId, tableName, tableRow }, originalUrl, body, errors = {}, errorSummary = null, user },
  res,
) => {
  try {
    const { questionGroup } = res.locals
    const returnUrl = removeUrlLevels(originalUrl, 3)

    // extract the table questions from the question group
    const thisTable = questionGroup.contents.find(element => element.tableCode === tableName)

    let heading = questionGroup.title || 'Edit item'
    let submitText = 'Save item'
    if (tableName === 'children_at_risk_of_serious_harm') {
      heading = 'Edit a child'
      submitText = 'Edit child'
    }
    res.locals.assessmentUuid = assessmentId

    const { answers } = await grabAnswers(assessmentId, 'current', user?.token, user?.id)

    // update answers to just appropriate ones for this table row
    // go through questions

    // if this question is in answers, change answer to just the one for this row
    thisTable.contents.forEach(question => {
      if (answers[question.questionCode] && answers[question.questionCode].length > tableRow) {
        if (Array.isArray(answers[question.questionCode][tableRow])) {
          answers[question.questionCode] = answers[question.questionCode][tableRow]
        } else {
          answers[question.questionCode] = [answers[question.questionCode][tableRow]]
        }
      }
    })

    let questions = annotateWithAnswers(thisTable.contents, answers, body)
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

module.exports = { editTableRow }
