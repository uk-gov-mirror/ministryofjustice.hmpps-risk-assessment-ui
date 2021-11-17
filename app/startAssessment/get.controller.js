const { differenceInYears, format } = require('date-fns')
const { assessmentSupervision, getCurrentEpisode } = require('../../common/data/hmppsAssessmentApi')
const logger = require('../../common/logging/logger')

const getErrorMessageFor = (user, reason) => {
  if (reason === 'OASYS_PERMISSION') {
    return 'You do not have permission to create this type of assessment. Speak to your manager and ask them to request a change to your level of authorisation.'
  }
  if (reason === 'DUPLICATE_OFFENDER_RECORD') {
    return `The offender is showing as a possible duplicate record under ${user.areaName}. Log into OASys to manage the duplication. If you need help, contact the OASys Application Support team`
  }

  if (reason === 'LAO_PERMISSION') {
    return 'You do not have the permissions needed to access this record'
  }

  return 'Something went wrong' // Unhandled exception
}
const validateAssessmentType = assessmentType => {
  if (!assessmentType) {
    throw new Error('Assessment type is mandatory')
  }
}

const validateCRN = crn => {
  if (!crn) {
    throw new Error('CRN is mandatory')
  }
}

const createAssessment = (user, crn, deliusEventId = '0', assessmentSchemaCode = 'RSR', deliusEventType = null) => {
  logger.info(`Creating ${assessmentSchemaCode} assessment for CRN: ${crn}`)

  const assessmentParams = { crn, deliusEventId, assessmentSchemaCode }
  if (deliusEventType) {
    assessmentParams.deliusEventType = deliusEventType
  }

  return assessmentSupervision(assessmentParams, user?.token, user?.id)
}

const getOffenceDetailsFor = episode => {
  const sentenceDate = episode?.offence?.sentenceDate

  return {
    offence: episode?.offence?.offenceCode,
    offenceDescription: episode?.offence?.codeDescription,
    subCode: episode?.offence?.offenceSubCode,
    subCodeDescription: episode?.offence?.subCodeDescription,
    sentenceDate: sentenceDate && format(new Date(sentenceDate), 'do MMMM y'),
  }
}

const getSubjectDetailsFor = (assessment, today = new Date()) => ({
  name: assessment?.subject?.name,
  dob: assessment?.subject?.dateOfBirth,
  pnc: assessment?.subject?.pnc,
  crn: assessment?.subject?.crn,
  subjectUuid: assessment?.subject?.subjectUuid,
  age: differenceInYears(today, new Date(assessment?.subject?.dateOfBirth)),
})

const startAssessment = async (req, res, next) => {
  const { crn, eventId = 1, assessmentType } = req.query

  try {
    validateCRN(crn)
    validateAssessmentType(assessmentType)

    const assessmentCode = assessmentType === 'UNPAID_WORK' ? 'UPW' : assessmentType
    const deliusEventType = assessmentType === 'UNPAID_WORK' ? 'EVENT_ID' : null

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

    req.session.assessment = {
      uuid: createAssessmentResponse?.assessmentUuid,
      episodeUuid: currentEpisode?.episodeUuid,
      offence: getOffenceDetailsFor(currentEpisode),
      subject: getSubjectDetailsFor(createAssessmentResponse),
    }

    req.session.save()

    return res.redirect(`/${assessmentCode}/start`)
  } catch (e) {
    return next(e)
  }
}

module.exports = {
  startAssessment,
}
