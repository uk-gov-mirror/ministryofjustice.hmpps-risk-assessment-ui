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

const createAssessment = async (user, crn, deliusEventId = '0', assessmentSchemaCode = 'RSR') => {
  logger.info(`Creating ${assessmentSchemaCode} assessment for CRN: ${crn}`)

  const [ok, response] = await assessmentSupervision(
    { crn, deliusEventId, assessmentSchemaCode },
    user?.token,
    user?.id,
  )

  if (!ok) {
    throw new Error(getErrorMessageFor(user, response.reason))
  }

  return response
}

const getOffenceDetailsFor = episode => {
  const sentenceDate = episode?.offence?.sentenceDate

  return {
    offence: episode?.offence?.offenceCode,
    subCode: episode?.offence?.offenceSubCode,
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

    const assessment = await createAssessment(req.user, crn, eventId, assessmentType)
    const currentEpisode = await getCurrentEpisode(assessment.assessmentUuid, req.user?.token, req.user?.id)

    req.session.assessment = {
      uuid: assessment?.assessmentUuid,
      episodeUuid: currentEpisode?.episodeUuid,
      offence: getOffenceDetailsFor(currentEpisode),
      subject: getSubjectDetailsFor(assessment),
    }

    req.session.save()

    res.redirect(`/${assessmentType}/start`)
  } catch (e) {
    next(e)
  }
}

module.exports = {
  startAssessment,
}
