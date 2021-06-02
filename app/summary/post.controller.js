/* eslint-disable no-param-reassign */
const { logger } = require('../../common/logging/logger')
const { displayOverview } = require('./get.controller')
const { postCompleteAssessment } = require('../../common/data/hmppsAssessmentApi')

const completeAssessment = async (req, res) => {
  const {
    params: { assessmentId },
    user,
  } = req

  try {
    const [ok] = await postCompleteAssessment(assessmentId, user?.token, user?.id)

    if (ok) {
      res.locals.hideOffenderDetails = true
      return res.render(`${__dirname}/success`, { offenderName: res.locals.offenderDetails.name })
    }
    res.locals.assessmentCompletedMessage = 'There was a problem marking the assessment as complete'
    res.locals.assessmentCompletedStatus = 'warning'

    return displayOverview(req, res)
  } catch (error) {
    logger.error(`Could not complete assessment ${assessmentId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { completeAssessment }
