const { Controller } = require('hmpo-form-wizard')

class CompleteRsrAssessment extends Controller {
  locals(req, res, next) {
    res.locals.panelText = `Your answers and scores for ${req.session.assessment?.subject?.name ||
      ' the offender'} have been uploaded to OASys`
    super.locals(req, res, next)
  }
}

module.exports = CompleteRsrAssessment
