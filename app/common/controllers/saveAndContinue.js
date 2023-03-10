const lodash = require('lodash')
const BaseController = require('./baseController')
const { SECTION_INCOMPLETE, CACHE } = require('../../../common/utils/constants')
const { getAnswers, postAnswers, getQuestionsForAssessmentType } = require('../../../common/data/hmppsAssessmentApi')
const logger = require('../../../common/logging/logger')
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

const postUpdateIfMigrated = async (originalAnswers, migratedAnswers, assessmentUuid, episodeUuid, user) => {
  if (!lodash.isEqual(originalAnswers, migratedAnswers)) {
    logger.info(`Saving updated answer structure for assessment ${assessmentUuid}, episode ${episodeUuid}`)
    try {
      await postAnswers(assessmentUuid, episodeUuid, { answers: migratedAnswers }, user?.token)
      return migratedAnswers
    } catch (error) {
      logger.error(
        `Could not save converted answers for assessment ${assessmentUuid}, episode ${episodeUuid}, error: ${error}`,
      )
    }
  }

  return originalAnswers
}

const filterAnswers = (answers, questionCodes) => {
  return Object.entries(answers).reduce((acc, [answerCode, value]) => {
    if (questionCodes.filter((questionCode) => questionCode === answerCode).length > 0) {
      return { ...acc, [answerCode]: value }
    }

    return acc
  }, {})
}

const filterSubmittedAnswers = (req) => {
  const submittedAnswers = req.sessionModel.get(CACHE.SUBMITTED_ANSWERS) || {}
  const questionCodes = Object.keys(req.form.options.fields)

  return filterAnswers(submittedAnswers, questionCodes)
}

class SaveAndContinue extends BaseController {
  constructor(...args) {
    super(...args)
    this.getAnswerModifiers = []
    this.postAnswerModifiers = []
  }

  async locals(req, res, next) {
    const errors = req.sessionModel.get(CACHE.ERRORS) || {}
    const { validationErrors, errorSummary } = pageValidationErrorsFrom(errors)
    res.locals.errors = validationErrors
    res.locals.errorSummary = errorSummary

    let persistedAnswers = req.sessionModel.get(CACHE.PERSISTED_ANSWERS)

    if (!persistedAnswers) {
      const apiResponse = await getAnswers(
        req.session.assessment?.uuid,
        req.session.assessment?.episodeUuid,
        req.user?.token,
      )

      persistedAnswers = apiResponse.answers
      req.sessionModel.set('persistedAnswers', persistedAnswers)
    }

    const modifiedAnswers = this.getAnswerModifiers.reduce((a, fn) => fn(a), persistedAnswers)

    const answers = await postUpdateIfMigrated(
      persistedAnswers,
      modifiedAnswers,
      req.session.assessment?.uuid,
      req.session.assessment?.episodeUuid,
      req.user,
    )

    // get a list of fields with multiple answers in the form [fieldName, answerGroup]
    // 'answerGroup' is the top level key that the API will use to send repeating groups of answers
    const questions = Object.entries(req.form.options.allFields)
    const multipleFields = questions
      .filter(([_, question]) => {
        return question.type === 'multiple'
      })
      .map(([questionCode, question]) => {
        return [questionCode, question.answerGroup]
      })

    const submittedAnswers = filterSubmittedAnswers(req)

    const questionsWithMappedAnswers = questions.map(withAnswersFrom(answers, answerDtoFrom(submittedAnswers)))

    const questionWithPreCompiledConditionals = compileConditionalQuestions(
      questionsWithMappedAnswers.filter((questionSchema) => req.form.options.fields[questionSchema.questionCode]),
      validationErrors,
    )

    const questionsWithReplacements = processReplacements(
      questionWithPreCompiledConditionals,
      req.session?.assessment?.subject,
    )

    res.locals.questions = questionsWithReplacements.reduce(keysByQuestionCode, {})
    res.locals.answers = questionsWithMappedAnswers.reduce(answersByQuestionCode, {})
    res.locals.persistedAnswers = { ...answers, ...answerDtoFrom(submittedAnswers) }

    // if editing a single 'record' from a multiples collection, add just that one to locals
    if (res.locals.questionGroupCode && res.locals.questionGroupIndex) {
      multipleFields
        .filter(([_, questionGroupCode]) => questionGroupCode === res.locals.questionGroupCode)
        .forEach(([questionCode]) => {
          const thisAnswer =
            res.locals.persistedAnswers[res.locals.questionGroupCode]?.[res.locals.questionGroupIndex]?.[
              questionCode
            ] || ''
          res.locals.questions[questionCode] = {
            ...(res.locals.questions[questionCode] || {}),
            answer: thisAnswer[0] || '',
          }
        })
    }

    // if editing a 'new' record from a multiples collection and nothing is yet submitted, clear the answers
    if (res.locals.questionGroupCode && res.locals.addingNewMultiple && errorSummary.length === 0) {
      res.locals.clearQuestionAnswers = true
    }

    req.sessionModel.set(CACHE.ERRORS, {})

    const submittedErrors = res.locals.errors || {}
    if (Object.keys(submittedErrors).length > 0) {
      const questionsForThisPage = res.locals.questions
      Object.entries(questionsForThisPage).forEach(([key]) => {
        questionsForThisPage[key].answer = req.form.values[key]
      })
      res.locals.questions = questionsForThisPage
    }

    super.locals(req, res, next)
  }

  async configure(req, res, next) {
    if (!req.session.assessment) {
      return next(new Error('No assessment selected'))
    }

    const combineLocalAndRemoteFields = (fields, remoteFields) =>
      Object.entries(fields).reduce(combinedLocalFieldsWith(remoteFields), {})
    const grabQuestions = async (request) => {
      try {
        const journeyName = request.form?.options?.journeyName || ''
        return await getQuestionsForAssessmentType(journeyName, request.user?.token)
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
    const filteredAnswers = filterAnswersByFields(req.form?.options?.fields, answersWithFormattedDates)

    // if user has selected 'I'll come back later' for this page, remove field validations for unanswered fields
    const sectionCompleteField = Object.keys(req.form?.options?.fields).find((key) => key.match(/^\w+_complete$/))
    if (filteredAnswers[sectionCompleteField] === SECTION_INCOMPLETE) {
      Object.keys(filteredAnswers).forEach((key) => {
        if (filteredAnswers[key] === '') {
          req.form.options.fields[key].validate = []
        }
      })
    }

    req.form.values = filteredAnswers

    req.sessionModel.set(CACHE.SUBMITTED_ANSWERS, req.form?.values || {})
    super.process(req, res, next)
  }

  async saveValues(req, res, next) {
    const { user } = req
    const submittedAnswers = req.sessionModel.get(CACHE.SUBMITTED_ANSWERS) || {}
    const answers = answerDtoFrom(submittedAnswers)

    // if is a new multiple then get previous answers for this multiple
    // and add new answers to it to send to API
    if (res.locals.addNewMultiple) {
      logger.debug(`Adding new multiple to existing answers: ${res.locals.addNewMultiple}`)
      const questions = Object.entries(req.form.options.allFields)
      const multipleFields = questions
        .filter(([_, question]) => {
          return question.type === 'multiple' && question.answerGroup === res.locals.addNewMultiple
        })
        .map(([questionCode]) => {
          return questionCode
        })
      const newMultipleAnswer = {}
      multipleFields.forEach((questionCode) => {
        newMultipleAnswer[questionCode] = answers[questionCode] || ''
        delete answers[questionCode]
      })

      const multipleKey = res.locals.addNewMultiple
      const persistedAnswers = req.sessionModel.get(CACHE.PERSISTED_ANSWERS)
      const existingMultiples = persistedAnswers[multipleKey] || []
      existingMultiples.push(newMultipleAnswer)
      answers[multipleKey] = existingMultiples
      persistedAnswers[multipleKey] = existingMultiples
      req.sessionModel.set(CACHE.PERSISTED_ANSWERS, persistedAnswers)

      logger.info(`Added new record to ${multipleKey} in assessment ${req.session?.assessment?.uuid}, current episode`)
      logger.debug(`New multiples record: ${JSON.stringify(existingMultiples)}`)
    }

    // if editing a multiple record
    if (res.locals.questionGroupCode) {
      const questions = Object.entries(req.form.options.allFields)
      const multipleFields = questions
        .filter(([_, question]) => {
          return question.type === 'multiple' && question.answerGroup === res.locals.questionGroupCode
        })
        .map(([questionCode]) => {
          return questionCode
        })

      const updatedMultiple = {}
      multipleFields.forEach((questionCode) => {
        updatedMultiple[questionCode] = answers[questionCode] || ''
        delete answers[questionCode]
      })

      const multipleKey = res.locals.questionGroupCode
      const persistedAnswers = req.sessionModel.get(CACHE.PERSISTED_ANSWERS)
      const existingMultiples = persistedAnswers[multipleKey]

      existingMultiples[res.locals.multipleUpdated] = updatedMultiple

      answers[multipleKey] = existingMultiples
      persistedAnswers[multipleKey] = existingMultiples
      req.sessionModel.set(CACHE.PERSISTED_ANSWERS, persistedAnswers)

      logger.info(
        `Edited record ${res.locals.multipleUpdated} of ${res.locals.questionGroupCode} in assessment ${req.session?.assessment?.uuid}, current episode`,
      )
      logger.debug(`New multiples record: ${JSON.stringify(existingMultiples)}`)
    }

    const answersToPost = this.postAnswerModifiers.reduce((a, fn) => fn(a), answers)

    try {
      const [ok, response] = await postAnswers(
        req.session?.assessment?.uuid,
        req.session?.assessment?.episodeUuid,
        { answers: answersToPost },
        user?.token,
      )

      if (ok) {
        // Update the local cache of answers to reflect what is persisted and clear the cache of previously submitted answers
        req.sessionModel.set(CACHE.PERSISTED_ANSWERS, response.answers)
        req.sessionModel.set(CACHE.SUBMITTED_ANSWERS, {})
        return super.saveValues(req, res, next)
      }

      return res.render('app/error', { subHeading: getErrorMessage(response.reason) })
    } catch (error) {
      logger.error(`Could not save to assessment ${req.session?.assessment?.uuid}, current episode, error: ${error}`)
      return res.render('app/error', { error })
    }
  }
}

module.exports = SaveAndContinue
