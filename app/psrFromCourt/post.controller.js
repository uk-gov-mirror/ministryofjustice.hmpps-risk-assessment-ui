// const { logger } = require('../../common/logging/logger')
const { assessmentSupervision } = require('../../common/data/hmppsAssessmentApi')

const getErrorMessageFor = (reason, user) => {
  if (reason === 'OASYS_PERMISSION') {
    return 'You do not have permission to create this type of assessment. Speak to your manager and ask them to request a change to your level of authorisation.'
  }
  if (reason === 'DUPLICATE_OFFENDER_RECORD') {
    return `The offender is showing as a possible duplicate record under ${user.areaName}. Log into OASys to manage the duplication. If you need help, contact the OASys Application Support team`
  }

  return 'Something went wrong' // Unhandled exception
}

const startPsr = async (courtCode, caseNumber, user, res) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const [ok, response] = await assessmentSupervision({ courtCode, caseNumber }, user?.token, user?.id)

    if (!ok) {
      return res.render('app/error', {
        subHeading: getErrorMessageFor(response.reason, user),
      })
    }

    return res.redirect(`/${response.assessmentUuid}/questionGroup/pre_sentence_assessment/summary`)
  } catch (error) {
    return res.render('app/error', { error })
  }
}

const startPsrFromCourt = ({ params: { courtCode, caseNumber }, user }, res) => {
  return startPsr(courtCode, caseNumber, user, res)
}

const startPsrFromForm = ({ body, user }, res) => {
  const { courtCode, caseNumber } = body

  return startPsr(courtCode, caseNumber, user, res)
}

module.exports = {
  startPsrFromCourt,
  startPsrFromForm,
}
