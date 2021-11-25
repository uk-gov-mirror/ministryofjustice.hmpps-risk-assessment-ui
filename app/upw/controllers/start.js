const BaseController = require('../../common/controllers/baseController')
const { trackEvent } = require('../../../common/logging/app-insights')
const { EVENTS } = require('../../../common/utils/constants')

class StartUnpaidWork extends BaseController {
  locals(req, res, next) {
    res.locals.pageDescription =
      'Your answers will be combined with OASys and nDelius information to create a PDF.<br>If you know nDelius and OASys information about the person needs changing, we advise you to do that before starting the assessment.'

    trackEvent(EVENTS.ARN_SESSION_STARTED, req)

    super.locals(req, res, next)
  }
}

module.exports = StartUnpaidWork
