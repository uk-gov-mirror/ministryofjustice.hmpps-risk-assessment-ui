const BaseController = require('../../common/controllers/baseController')
const { trackEvent } = require('../../../common/logging/app-insights')
const { EVENTS } = require('../../../common/utils/constants')
const { startAssessment, getCurrentEpisode } = require('../../../common/data/hmppsAssessmentApi')
const logger = require('../../../common/logging/logger')
const { getErrorMessageFor, ageFrom } = require('../../../common/utils/util')

const createAssessment = (user, crn, deliusEventId = '0', assessmentSchemaCode = 'UPW') => {
  logger.info(`Creating ${assessmentSchemaCode} assessment for CRN: ${crn}`)

  const assessmentParams = { crn, deliusEventId, assessmentSchemaCode }

  return startAssessment(assessmentParams, user?.token)
}

const getSubjectDetailsFor = (assessment) => ({
  name: assessment?.subject?.name,
  dob: assessment?.subject?.dateOfBirth,
  pnc: assessment?.subject?.pnc,
  crn: assessment?.subject?.crn,
  subjectUuid: assessment?.subject?.subjectUuid,
  age: ageFrom(assessment?.subject?.dateOfBirth),
})

class StartUnpaidWork extends BaseController {
  locals(req, res, next) {
    trackEvent(EVENTS.ARN_SESSION_STARTED, req)

    super.locals(req, res, next)
  }

  // eslint-disable-next-line consistent-return
  async saveValues(req, res, next) {
    try {
      const { assessment } = req.session
      const { eventId, assessmentCode } = assessment
      const { crn } = assessment.subject

      logger.debug(`req.session.assessment: ${JSON.stringify(assessment)}`)

      const [assessmentCreated, createAssessmentResponse] = await createAssessment(
        req.user,
        crn,
        eventId,
        assessmentCode,
      )

      logger.debug(`createAssessment response: ${JSON.stringify(createAssessmentResponse)}`)

      if (!assessmentCreated) {
        return res.render('app/error', { subHeading: getErrorMessageFor(req.user, createAssessmentResponse.reason) })
      }

      const currentEpisode = await getCurrentEpisode(createAssessmentResponse.assessmentUuid, req.user?.token)

      logger.debug(`getCurrentEpisode response: ${JSON.stringify(currentEpisode)}`)

      // update subject details in session
      assessment.subject = {
        ...assessment.subject,
        ...getSubjectDetailsFor(createAssessmentResponse),
      }

      assessment.uuid = createAssessmentResponse?.assessmentUuid
      assessment.episodeUuid = currentEpisode?.episodeUuid
      assessment.lastEditedBy = currentEpisode?.userFullName
      assessment.lastEditedDate = currentEpisode?.lastEditedDate

      req.session.assessment = assessment

      logger.debug(`saving assessment to session: ${JSON.stringify(assessment)}`)

      req.session.save()

      super.saveValues(req, res, next)
    } catch (e) {
      next(new Error('Failed to create assessment'))
    }
  }
}

module.exports = StartUnpaidWork
