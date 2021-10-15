const BaseController = require('../../common/controllers/baseController')

class StartUnpaidWork extends BaseController {
  locals(req, res, next) {
    res.locals.pageDescription =
      'Your answers will be combined with OASys and nDelius information. A full PDF version will then be created.'

    super.locals(req, res, next)
  }
}

module.exports = StartUnpaidWork
