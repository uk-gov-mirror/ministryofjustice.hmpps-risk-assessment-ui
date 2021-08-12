const { logger } = require('../../common/logging/logger')

const submitPredictorScores = async (req, res) => {
  try {
    const {
      params: { assessmentId, assessmentType },
    } = req

    const offenderName = res.locals.offenderDetails?.name || 'the offender'

    logger.info(`Creating final predictor scores for episode: ${assessmentId} of type: ${assessmentType}`)

    // TODO: create final predictor scores

    return res.render(`${__dirname}/index`, {
      panelText: `Your answers and scores for ${offenderName} have been uploaded to OASys`,
      navigation: {
        next: { url: '/' },
      },
    })
  } catch (error) {
    return res.render('app/error', { error })
  }
}

module.exports = { submitPredictorScores }
