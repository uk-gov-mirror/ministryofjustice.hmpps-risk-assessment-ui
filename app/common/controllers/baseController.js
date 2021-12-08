const { Controller } = require('hmpo-form-wizard')

class BaseController extends Controller {
  configure(req, res, next) {
    if (!req.session.assessment) {
      return next(new Error('No assessment selected'))
    }

    return super.configure(req, res, next)
  }

  async locals(req, res, next) {
    res.locals.csrfToken = res.locals['csrf-token']
    delete res.locals['csrf-token']

    res.locals.assessment = req.session.assessment || {}

    super.locals(req, res, next)
  }
}

module.exports = BaseController
