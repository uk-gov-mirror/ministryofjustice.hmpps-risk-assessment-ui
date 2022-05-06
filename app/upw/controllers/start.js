const { differenceInYears } = require('date-fns')
const BaseController = require('../../common/controllers/baseController')
const { trackEvent } = require('../../../common/logging/app-insights')
const { EVENTS } = require('../../../common/utils/constants')
const { assessmentSupervision, getCurrentEpisode } = require('../../../common/data/hmppsAssessmentApi')
const logger = require('../../../common/logging/logger')
const { getErrorMessageFor } = require('../../../common/utils/util')

const createAssessment = (user, crn, deliusEventId = '0', assessmentSchemaCode = 'UPW', deliusEventType = null) => {
  logger.info(`Creating ${assessmentSchemaCode} assessment for CRN: ${crn}`)

  const assessmentParams = { crn, deliusEventId, assessmentSchemaCode }
  if (deliusEventType) {
    assessmentParams.deliusEventType = deliusEventType
  }

  return assessmentSupervision(assessmentParams, user?.token, user?.id)
}

const getSubjectDetailsFor = (assessment, today = new Date()) => ({
  name: assessment?.subject?.name,
  dob: assessment?.subject?.dateOfBirth,
  pnc: assessment?.subject?.pnc,
  crn: assessment?.subject?.crn,
  subjectUuid: assessment?.subject?.subjectUuid,
  age: differenceInYears(today, new Date(assessment?.subject?.dateOfBirth)),
})

class StartUnpaidWork extends BaseController {
  locals(req, res, next) {
    res.locals.pageDescription =
      'Your answers will be combined with OASys and nDelius information to create a PDF.<br>If you know nDelius and OASys information about the person needs changing, we advise you to do that before starting the assessment.'

    trackEvent(EVENTS.ARN_SESSION_STARTED, req)

    super.locals(req, res, next)
  }

  // eslint-disable-next-line consistent-return
  async saveValues(req, res, next) {
    const { assessment } = req.session
    const { eventId, assessmentCode, deliusEventType } = assessment
    const { crn } = assessment.subject

    const [assessmentCreated, createAssessmentResponse] = await createAssessment(
      req.user,
      crn,
      eventId,
      assessmentCode,
      deliusEventType,
    )

    if (!assessmentCreated) {
      return res.render('app/error', { subHeading: getErrorMessageFor(req.user, createAssessmentResponse.reason) })
    }

    const currentEpisode = await getCurrentEpisode(
      createAssessmentResponse.assessmentUuid,
      req.user?.token,
      req.user?.id,
    )

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
    req.session.save()

    super.saveValues(req, res, next)
  }
}

module.exports = StartUnpaidWork
