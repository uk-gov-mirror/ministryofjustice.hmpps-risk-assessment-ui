const BaseSaveAndContinue = require('../../common/controllers/saveAndContinue')
const { getRegistrations, getRoshRiskSummary } = require('./common.utils')

class Declaration extends BaseSaveAndContinue {
  async locals(req, res, next) {
    const deliusRegistrations = await getRegistrations(req.session.assessment?.subject?.crn, req.user)
    const roshRiskSummary = await getRoshRiskSummary(req.session.assessment?.subject?.crn, req.user)

    res.locals.widgetData = {
      ...deliusRegistrations,
      ...roshRiskSummary,
    }

    await super.locals(req, res, next)

    const validationErrors = Object.keys(req.form.errors)

    const { answers } = res.locals
    if (validationErrors.length > 0) {
      req.sessionModel.set('formAnswers', answers)
    }
    res.locals.answers = answers
  }

  saveValues(req, res, next) {
    const answers = req.sessionModel.get('formAnswers') || {}
    req.sessionModel.set('answers', answers)

    super.saveValues(req, res, next)
  }
}

module.exports = Declaration
