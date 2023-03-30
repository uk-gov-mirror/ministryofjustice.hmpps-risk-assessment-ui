const { trackEvent } = require('../../../common/logging/app-insights')
const BaseSaveAndContinue = require('../../common/controllers/saveAndContinue')
const { getRegistrations, getRoshRiskSummary } = require('./common.utils')
const { EVENTS, SECTION_COMPLETE, CACHE } = require('../../../common/utils/constants')
const {
  createMultiplesFields,
  migrateGpDetails,
  migrateEmergencyContacts,
  removeOldFields,
} = require('./saveAndContinue.utils')

const invalidateSectionCompleteAnswers = (answers, fields) => {
  return Object.entries(answers)
    .map(([key, value]) => (fields.includes(key) ? [key, ''] : [key, value]))
    .reduce((a, [key, value]) => ({ ...a, [key]: value }), {})
}

class SaveAndContinue extends BaseSaveAndContinue {
  constructor(...args) {
    super(...args)

    // Apply migrations where fields have changed and cleanup unused ones
    this.getAnswerModifiers = [createMultiplesFields, migrateGpDetails, migrateEmergencyContacts, removeOldFields]
  }

  async locals(req, res, next) {
    const crn = req.session.assessment?.subject?.crn
    const eventId = req.session.assessment?.eventId

    const deliusRegistrations = await getRegistrations(crn, eventId, req.user)
    const { roshRiskSummary } = await getRoshRiskSummary(crn, req.user)

    if (roshRiskSummary?.hasBeenCompleted === false) {
      trackEvent(EVENTS.ARN_NO_ROSH_DATA_AVAILABLE, req)
    }

    res.locals.widgetData = {
      ...deliusRegistrations,
      roshRiskSummary,
    }

    await super.locals(req, res, next)

    const validationErrors = Object.keys(req.form.errors)
    const sectionCompleteFields = Object.keys(req.form?.options?.fields).filter((key) => key.match(/^\w+_complete$/))

    let { answers } = res.locals

    if (validationErrors.length > 0) {
      answers = invalidateSectionCompleteAnswers(answers, sectionCompleteFields)
      req.sessionModel.set(CACHE.SUBMITTED_ANSWERS, answers)
    } else {
      trackEvent(EVENTS.ARN_SECTION_STARTED, req, { sectionName: req.form?.options?.pageTitle })
    }

    res.locals.answers = answers
  }

  saveValues(req, res, next) {
    super.saveValues(req, res, next)
  }

  successHandler(req, res, next) {
    const sectionCompleteFields = Object.keys(req.form?.options?.fields).filter((key) => key.match(/^\w+_complete$/))
    const answers = req.sessionModel.get(CACHE.PERSISTED_ANSWERS) || {}
    const answer = answers[sectionCompleteFields[0]]
    const sectionComplete = Array.isArray(answer) && answer.includes(SECTION_COMPLETE)

    trackEvent(EVENTS.ARN_SECTION_COMPLETED, req, {
      sectionName: req.form?.options?.pageTitle,
      completed: sectionComplete,
    })

    super.successHandler(req, res, next)
  }
}

module.exports = SaveAndContinue
