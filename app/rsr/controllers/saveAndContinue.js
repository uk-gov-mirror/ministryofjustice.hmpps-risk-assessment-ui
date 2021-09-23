const { Controller } = require('hmpo-form-wizard')
const { postAnswers } = require('../../../common/data/hmppsAssessmentApi')
const { formatValidationErrors, assembleDates } = require('../../../common/middleware/questionGroups/postHandlers')
const { logger } = require('../../../common/logging/logger')
const { customValidations } = require('../fields')
const getAssessmentQuestions = require('../../../common/middleware/getAssessmentQuestions')

const getErrorMessage = reason => {
  if (reason === 'OASYS_PERMISSION') {
    return 'You do not have permission to update this type of assessment. Speak to your manager and ask them to request a change to your level of authorisation.'
  }

  return 'Something went wrong'
}

class SaveAndContinue extends Controller {
  // GET steps
  async locals(req, res, next) {
    res.locals.csrfToken = res.locals['csrf-token']
    delete res.locals['csrf-token']

    // get questions
    await getAssessmentQuestions(req, res, next)
    res.locals.assessment = req.session.assessment || {}

    super.locals(req, res, next)
  }

  // POST steps
  async configure(req, res, next) {
    await assembleDates(req, res, () => {})
    super.configure(req, res, next)
  }

  process(req, res, next) {
    req.sessionModel.set('answers', req.form.values)
    super.process(req, res, next)
  }

  async validateFields(req, res, next) {
    // at this point makes changes to sessionModel fields to add in context specific validations
    const { date_first_sanction = '', total_sanctions = '' } = req.form.values
    const offenderDob = req.session?.assessment?.subject?.dob
    req.sessionModel.options.fields = customValidations(
      req.sessionModel.options.fields,
      offenderDob,
      date_first_sanction,
      total_sanctions,
    )
    super.validateFields(req, res, next)
  }

  validate(req, res, next) {
    super.validate(req, res, next)
  }

  async saveValues(req, res, next) {
    const { user, body: answers } = req

    try {
      await assembleDates(req, res, () => {})
      const [ok, response] = await postAnswers(
        req.session?.assessment?.uuid,
        'current',
        { answers },
        user?.token,
        user?.id,
      )

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
      logger.error(`Could not save to assessment ${req.session?.assessment?.uuid}, current episode, error: ${error}`)
      return res.render('app/error', { error })
    }
  }
}

module.exports = SaveAndContinue
