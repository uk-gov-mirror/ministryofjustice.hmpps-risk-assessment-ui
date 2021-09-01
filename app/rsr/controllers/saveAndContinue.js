const { Controller } = require('hmpo-form-wizard')

class SaveAndContinue extends Controller {
  validate(req, res, next) {
    super.validate(req, res, next)
  }

  locals(req, res, next) {
    res.locals.csrfToken = res.locals['csrf-token']
    delete res.locals['csrf-token']
    super.locals(req, res, next)
  }
}

module.exports = SaveAndContinue
