/* eslint-disable no-param-reassign */
const { logger } = require('../../common/logging/logger')
const { postCompleteAssessment } = require('../../common/data/hmppsAssessmentApi')

const getErrorMessage = (reason) => {
  if (reason === 'OASYS_PERMISSION') {
    return 'You do not have permission to complete this type of assessment. Speak to your manager and ask them to request a change to your level of authorisation.'
  }

  return 'Something went wrong'
}

const completeAssessment = async (req, res) => {
  const {
    params: { assessmentId },
    user,
  } = req

  try {
    const [ok, response] = await postCompleteAssessment(assessmentId, user?.token, user?.id)

    if (!ok) {
      return res.render('app/error', { subHeading: getErrorMessage(response.reason) })
    }

    res.locals.hideOffenderDetails = true
    return res.render(`${__dirname}/success`, { offenderName: res.locals.offenderDetails.name })
  } catch (error) {
    logger.error(`Could not complete assessment ${assessmentId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { completeAssessment }
