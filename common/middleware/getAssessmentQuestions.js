const { getFlatAssessmentQuestions } = require('../data/hmppsAssessmentApi')
const { processReplacements } = require('../utils/util')
const logger = require('../logging/logger')
const { compileInlineConditionalQuestions } = require('./questionGroups/getHandlers')

module.exports = async ({ params: { assessmentCode = 'RSR', assessmentVersion = 1 }, user }, res, next) => {
  try {
    let questions = await getFlatAssessmentQuestions(assessmentCode, assessmentVersion, user?.token, user?.id)

    questions = compileInlineConditionalQuestions(questions, {})
    questions = processReplacements(questions, res.locals.offenderDetails)

    const questionLookup = {}
    questions.forEach(q => {
      questionLookup[q.questionCode] = q
    })
    res.locals.questions = questionLookup

    return next()
  } catch (error) {
    logger.error(
      `Could not retrieve questions for assessment ${assessmentCode} version ${assessmentVersion}, error: ${error}`,
    )
    return res.render('app/error', { error })
  }
}
