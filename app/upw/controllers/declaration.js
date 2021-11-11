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

    super.locals(req, res, next)
  }
}

module.exports = Declaration
