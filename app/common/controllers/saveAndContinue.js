const BaseController = require('./baseController')
const { getAnswers, postAnswers, getFlatAssessmentQuestions } = require('../../../common/data/hmppsAssessmentApi')
const { logger } = require('../../../common/logging/logger')
const { processReplacements } = require('../../../common/utils/util')
const {
  compileConditionalQuestions,
  getErrorMessage,
  pageValidationErrorsFrom,
  withAnswersFrom,
  keysByQuestionCode,
  combineDateFields,
  combinedLocalFieldsWith,
  answerDtoFrom,
} = require('./saveAndContinue.utils')

class SaveAndContinue extends BaseController {
  async locals(req, res, next) {
    const errors = req.sessionModel.get('errors') || {}
    const { validationErrors, errorSummary } = pageValidationErrorsFrom(errors)
    res.locals.errors = validationErrors
    res.locals.errorSummary = errorSummary

    const { answers: previousAnswers } = await getAnswers(
      req.session.assessment?.uuid,
      'current',
      req.user?.token,
      req.user?.id,
    )
    const submittedAnswers = req.sessionModel.get('answers') || {}

    const questions = Object.entries(req.form.options.fields)
    const questionsWithMappedAnswers = questions.map(withAnswersFrom(previousAnswers, submittedAnswers))
    const questionWithPreCompiledConditionals = compileConditionalQuestions(
      questionsWithMappedAnswers,
      validationErrors,
    )

    const questionsWithReplacements = processReplacements(
      questionWithPreCompiledConditionals,
      req.session?.assessment?.subject,
    )

    res.locals.questions = questionsWithReplacements.reduce(keysByQuestionCode, {})

    super.locals(req, res, next)
  }

  async configure(req, res, next) {
    const combineLocalAndRemoteFields = (fields, remoteFields) =>
      Object.entries(fields).reduce(combinedLocalFieldsWith(remoteFields), {})
    const grabQuestions = async request => {
      try {
        const journeyName = request.form?.options?.journeyName || ''
        return await getFlatAssessmentQuestions(journeyName, request.user?.token, request.user?.id)
      } catch (e) {
        return []
      }
    }
    const questions = await grabQuestions(req)
    const questionMap = questions.reduce(keysByQuestionCode, {})
    req.form.options.allFields = combineLocalAndRemoteFields(req.form.options.allFields, questionMap)
    req.form.options.fields = combineLocalAndRemoteFields(req.form.options.fields, questionMap)

    super.configure(req, res, next)
  }

  async process(req, res, next) {
    const withValuesFrom = (answers, fields) => (otherAnswers, currentField) => {
      const dependency = fields[currentField]?.dependent
      let answer = answers[currentField] || ''

      if (dependency && otherAnswers[dependency.field] !== dependency.value) {
        answer = ''
      }

      return {
        ...otherAnswers,
        [currentField]: answer,
      }
    }
    const filterAnswersByFields = (fields, answers) => Object.keys(fields).reduce(withValuesFrom(answers, fields), {})

    const requestBody = req.body || {}
    const answersWithFormattedDates = combineDateFields(requestBody)
    const answersInSession = req.sessionModel.get('answers')
    const filteredAnswers = filterAnswersByFields(req.form?.options?.fields, answersWithFormattedDates)
    req.form.values = { ...answersInSession, ...filteredAnswers }
    req.sessionModel.set('answers', req.form?.values || {})
    super.process(req, res, next)
  }

  async saveValues(req, res, next) {
    const { user } = req
    const answers = answerDtoFrom(req.sessionModel.get('answers'))

    try {
      const [ok, response] = await postAnswers(
        req.session?.assessment?.uuid,
        'current',
        { answers },
        user?.token,
        user?.id,
      )

      if (ok) {
        return super.saveValues(req, res, next)
      }
      // Errors returned from OASys
      if (response.status === 422) {
        const { validationErrors, errorSummary } = pageValidationErrorsFrom(response.errors, response.pageErrors)
        req.errors = validationErrors
        req.errorSummary = errorSummary
        // TODO: add OASys errors to page and redisplay
      }
      return res.render('app/error', { subHeading: getErrorMessage(response.reason) })
    } catch (error) {
      logger.error(`Could not save to assessment ${req.session?.assessment?.uuid}, current episode, error: ${error}`)
      return res.render('app/error', { error })
    }
  }
}

module.exports = SaveAndContinue
