const { Controller } = require('hmpo-form-wizard')
const { format } = require('date-fns')
const logger = require('../../../common/logging/logger')

const createFromCrn = crn => {
  logger.info(`Creating assessment for CRN: ${crn}`)

  return {
    assessmentUuid: '12345678-1234-1234-1234-1234-123456789012',
  }
}

const getOffenceDetailsFor = subjectUuid => {
  logger.info(`Getting offender details for: ${subjectUuid}`)

  const date = Date.now()
  const datePart = format(date, 'd MMM y')
  const timePart = format(date, 'HH:mm:ss')

  return {
    offence: 'Some offence',
    subCode: 'Some sub-offence',
    sentenceDate: `${datePart} at ${timePart}`,
  }
}

const getSubjectDetailsFor = assessmentUuid => {
  logger.info(`Getting subject details for: ${assessmentUuid}`)

  return {
    name: 'John Smith',
    subjectUuid: '12345678-1234-1234-1234-1234-123456789012',
  }
}

class StartRsr extends Controller {
  getValues(req, res, next) {
    const assessmentDetails = createFromCrn(req.query.crn) // Could/Should this move to the POST saveValues hook?
    const subjectDetails = getSubjectDetailsFor(assessmentDetails.assessmentUuid)
    const offenceDetails = getOffenceDetailsFor(subjectDetails.subjectUuid)

    req.session.assessment = {
      offence: offenceDetails,
      subject: subjectDetails,
    }
    req.session.save()

    super.getValues(req, res, next)
  }

  locals(req, res, next) {
    res.locals.csrfToken = res.locals['csrf-token'] // TODO: move this to a BaseController class
    res.locals.assessment = req.session.assessment

    super.locals(req, res, next)
  }
}

module.exports = StartRsr
