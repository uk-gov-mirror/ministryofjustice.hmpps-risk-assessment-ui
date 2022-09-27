const { trackEvent } = require('../../../common/logging/app-insights')
const BaseSaveAndContinue = require('../../common/controllers/saveAndContinue')
const { getRegistrations, getRoshRiskSummary } = require('./common.utils')
const { EVENTS, SECTION_COMPLETE } = require('../../../common/utils/constants')
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
    const deliusRegistrations = await getRegistrations(req.session.assessment?.subject?.crn, req.user)
    const { roshRiskSummary } = await getRoshRiskSummary(req.session.assessment?.subject?.crn, req.user)

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
      req.sessionModel.set('formAnswers', answers)
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
    const answers = req.sessionModel.get('persistedAnswers') || {}
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
