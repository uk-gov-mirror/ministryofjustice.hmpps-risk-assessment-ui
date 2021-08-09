const { logger } = require('../../common/logging/logger')

const submitPredictorScores = async (req, res) => {
  try {
    const {
      params: { episodeUuid, assessmentType },
    } = req

    const offenderName = res.locals.offenderDetails?.name || 'the offender'

    logger.info(`Creating final predictor scores for episode: ${episodeUuid} of type: ${assessmentType}`)

    // TODO: Call assessments API to finalise the predictor scores

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
