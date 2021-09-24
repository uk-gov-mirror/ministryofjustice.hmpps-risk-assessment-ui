const { getFlatAssessmentQuestions, getAnswers } = require('../data/hmppsAssessmentApi')
const { processReplacements } = require('../utils/util')
const logger = require('../logging/logger')
const { compileInlineConditionalQuestions, annotateWithAnswers } = require('./questionGroups/getHandlers')

const formatWizardValidationErrors = validationErrors => {
  const errors = {}
  const errorSummary = []
  if (validationErrors) {
    for (let i = 0; i < Object.entries(validationErrors).length; i += 1) {
      const { key, message, headerMessage } = Object.entries(validationErrors)[i][1]
      errors[`${key}`] = { text: message }
      errorSummary.push({
        text: headerMessage || message,
        href: `#${key}-error`,
      })
    }
  }
  return [errors, errorSummary]
}

module.exports = async (req, res, next) => {
  const {
    params: { assessmentCode = 'RSR' },
    user,
    sessionModel,
  } = req
  try {
    let questions = await getFlatAssessmentQuestions(assessmentCode, user?.token, user?.id)
    const userAnswers = sessionModel.get('answers')

    const { answers } = await getAnswers(req.session?.assessment?.uuid, 'current', user?.token, user?.id)
    questions = annotateWithAnswers(questions, answers, userAnswers)

    const errors = sessionModel.get('errors')

    const [validationErrors, errorSummary] = formatWizardValidationErrors(errors)
    res.locals.errors = validationErrors
    res.locals.errorSummary = errorSummary

    questions = compileInlineConditionalQuestions(questions, res.locals.errors)
    questions = processReplacements(questions, req.session?.assessment?.subject)

    const byQuestionCode = (a, q) => ({ ...a, [q.questionCode]: q })
    const questionLookup = questions.reduce(byQuestionCode, {})
    res.locals.questions = questionLookup

    return questionLookup
  } catch (error) {
    logger.error(`Could not retrieve questions for assessment ${assessmentCode}, error: ${error}`)
    return res.render('app/error', { error })
  }
}
