const BaseController = require('../../common/controllers/baseController')

class StartUnpaidWork extends BaseController {
  locals(req, res, next) {
    res.locals.pageDescription =
      'Your answers will be combined with OASys and nDelius information to create a PDF.<br>If you know nDelius and OASys information about the person needs changing, we advise you to do that before starting the assessment.'

    super.locals(req, res, next)
  }
}

module.exports = StartUnpaidWork
