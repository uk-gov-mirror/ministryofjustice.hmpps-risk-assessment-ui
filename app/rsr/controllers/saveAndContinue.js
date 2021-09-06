const { Controller } = require('hmpo-form-wizard')
const { postAnswers } = require('../../../common/data/hmppsAssessmentApi')
const { formatValidationErrors, assembleDates } = require('../../../common/middleware/questionGroups/postHandlers')
const { logger } = require('../../../common/logging/logger')

const getErrorMessage = reason => {
  if (reason === 'OASYS_PERMISSION') {
    return 'You do not have permission to update this type of assessment. Speak to your manager and ask them to request a change to your level of authorisation.'
  }

  return 'Something went wrong'
}

class SaveAndContinue extends Controller {
  validate(req, res, next) {
    super.validate(req, res, next)
  }

  locals(req, res, next) {
    res.locals.csrfToken = res.locals['csrf-token']
    delete res.locals['csrf-token']
    super.locals(req, res, next)
  }

  async saveValues(req, res, next) {
    const { user, body: answers } = req

    try {
      await assembleDates(req, res, () => {})
      const [ok, response] = await postAnswers(res.locals.assessmentId, 'current', { answers }, user?.token, user?.id)

      if (ok) {
        return super.saveValues(req, res, next)
      }
      // errors returned from OASys
      if (response.status === 422) {
        const [validationErrors, errorSummary] = formatValidationErrors(response.errors, response.pageErrors)
        req.errors = validationErrors
        req.errorSummary = errorSummary
        // todo: add OASys errors to page and redisplay
      }
      return res.render('app/error', { subHeading: getErrorMessage(response.reason) })
    } catch (error) {
      logger.error(`Could not save to assessment ${res.locals.assessmentId}, current episode, error: ${error}`)
      return res.render('app/error', { error })
    }
  }
}

module.exports = SaveAndContinue
