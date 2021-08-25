const { postCompleteAssessment } = require('../../common/data/hmppsAssessmentApi')
const { logger } = require('../../common/logging/logger')

const submitPredictorScores = async (req, res) => {
  try {
    const {
      params: { assessmentId, assessmentType },
      user,
    } = req

    const offenderName = res.locals.offenderDetails?.name || 'the offender'

    logger.info(
      `Creating final predictor scores and completing the assessment for: ${assessmentId} of type: ${assessmentType}`,
    )

    const [ok] = await postCompleteAssessment(assessmentId, user?.token, user?.id)

    if (ok) {
      return res.render(`${__dirname}/index`, {
        panelText: `Your answers and scores for ${offenderName} have been uploaded to OASys`,
        navigation: {
          next: { url: '/' },
        },
      })
    }

    return res.render('app/error', { error: new Error('Failed to complete the assessment') })
  } catch (error) {
    return res.render('app/error', { error })
  }
}

module.exports = { submitPredictorScores }
