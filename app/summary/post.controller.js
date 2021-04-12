/* eslint-disable no-param-reassign */
const { logger } = require('../../common/logging/logger')
const { displayOverview } = require('./get.controller')
const { postCompleteAssessment } = require('../../common/data/hmppsAssessmentApi')

const completeAssessment = async (req, res) => {
  const {
    params: { assessmentId },
    tokens,
  } = req

  try {
    const [ok] = await postCompleteAssessment(assessmentId, tokens)

    if (ok) {
      res.locals.assessmentCompletedMessage = 'Assessment has been marked as complete'
      res.locals.assessmentCompletedStatus = 'success'
    } else {
      res.locals.assessmentCompletedMessage = 'There was a problem marking the assessment as complete'
      res.locals.assessmentCompletedStatus = 'warning'
    }

    return displayOverview(req, res)
  } catch (error) {
    logger.error(`Could not complete assessment ${assessmentId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { completeAssessment }
