const BaseController = require('./baseController')
const { SECTION_INCOMPLETE } = require('../../../common/utils/constants')
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
  answersByQuestionCode,
} = require('./saveAndContinue.utils')

class SaveAndContinue extends BaseController {
  async locals(req, res, next) {
    const errors = req.sessionModel.get('errors') || {}
    const { validationErrors, errorSummary } = pageValidationErrorsFrom(errors)
    res.locals.errors = validationErrors
    res.locals.errorSummary = errorSummary

    const { answers: previousAnswers } = await getAnswers(
      req.session.assessment?.uuid,
      req.session.assessment?.episodeUuid,
      req.user?.token,
      req.user?.id,
    )

    const submittedAnswers =
      errorSummary.length === 0 ? req.sessionModel.get('answers') || {} : req.sessionModel.get('formAnswers') || {}

    const questions = Object.entries(req.form.options.allFields)
    const questionsWithMappedAnswers = questions.map(withAnswersFrom(previousAnswers, submittedAnswers))

    const questionWithPreCompiledConditionals = compileConditionalQuestions(
      questionsWithMappedAnswers.filter(questionSchema => req.form.options.fields[questionSchema.questionCode]),
      validationErrors,
    )

    const questionsWithReplacements = processReplacements(
      questionWithPreCompiledConditionals,
      req.session?.assessment?.subject,
    )

    res.locals.questions = questionsWithReplacements.reduce(keysByQuestionCode, {})
    res.locals.answers = questionsWithMappedAnswers.reduce(answersByQuestionCode, {})
    res.locals.rawAnswers = { ...previousAnswers, ...submittedAnswers }

    req.sessionModel.set('errors', {})

    super.locals(req, res, next)
  }

  async configure(req, res, next) {
    if (!req.session.assessment) {
      return next(new Error('No assessment selected'))
    }

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

    return super.configure(req, res, next)
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

    // if user has selected 'I'll come back later' for this page, remove field validations for unanswered fields
    const sectionCompleteField = Object.keys(req.form?.options?.fields).find(key => key.match(/^\w+_complete$/))
    if (filteredAnswers[sectionCompleteField] === SECTION_INCOMPLETE) {
      Object.keys(filteredAnswers).forEach(key => {
        if (filteredAnswers[key] === '') {
          req.form.options.fields[key].validate = []
        }
      })
    }

    req.form.values = { ...answersInSession, ...filteredAnswers }

    req.sessionModel.set('formAnswers', req.form?.values || {})
    super.process(req, res, next)
  }

  async saveValues(req, res, next) {
    const { user } = req
    const answers = answerDtoFrom(req.sessionModel.get('answers'))

    // if is a new multiple then get previous answers for this multiple
    // and add new answers to it to send to API
    if (res.locals.addNewMultiple) {
      const questions = Object.entries(req.form.options.allFields)
      const multipleFields = questions
        .filter(value => {
          return value[1].type === 'multiple' && value[1].answerGroup === res.locals.addNewMultiple
        })
        .map(field => {
          return field[0]
        })
      const newMultipleAnswer = {}
      multipleFields.forEach(field => {
        newMultipleAnswer[field] = answers[field] || ''
        delete answers[field]
      })

      const multipleKey = res.locals.addNewMultiple
      const rawAnswers = req.sessionModel.get('rawAnswers')
      const existingMultiple = rawAnswers[multipleKey]
      existingMultiple.push(newMultipleAnswer)
      answers[multipleKey] = existingMultiple

      rawAnswers[multipleKey] = existingMultiple
      req.sessionModel.set('rawAnswers', rawAnswers)
      req.sessionModel.set('answers', answers)

      logger.info(`Added new record to ${multipleKey} in assessment ${req.session?.assessment?.uuid}, current episode`)
    }

    // if editing a multiple record
    if (res.locals.editMultiple) {
      const questions = Object.entries(req.form.options.allFields)
      const multipleFields = questions
        .filter(value => {
          return value[1].type === 'multiple' && value[1].answerGroup === res.locals.editMultiple
        })
        .map(field => {
          return field[0]
        })

      const newMultipleAnswer = {}
      multipleFields.forEach(field => {
        newMultipleAnswer[field] = answers[field] || ''
        delete answers[field]
      })

      const multipleKey = res.locals.editMultiple
      const rawAnswers = req.sessionModel.get('rawAnswers')
      const existingMultiple = rawAnswers[multipleKey]

      existingMultiple[res.locals.multipleUpdated] = newMultipleAnswer

      answers[multipleKey] = existingMultiple
      rawAnswers[multipleKey] = existingMultiple
      req.sessionModel.set('rawAnswers', rawAnswers)
      req.sessionModel.set('answers', answers)
    }

    try {
      const [ok, response] = await postAnswers(
        req.session?.assessment?.uuid,
        req.session?.assessment?.episodeUuid,
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
