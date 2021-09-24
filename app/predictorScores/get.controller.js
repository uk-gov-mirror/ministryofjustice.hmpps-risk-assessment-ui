const { getDraftPredictorScore } = require('../../common/data/hmppsAssessmentApi')
const { splitPredictorScores } = require('../../common/utils/predictors')
const logger = require('../../common/logging/logger')

const getSubheadingFor = assessmentType => {
  const subheadings = { RSR: 'Risk of Serious Recidivism (RSR) assessment' }
  return subheadings[assessmentType]
}

const displayPredictorScores = async (req, res) => {
  try {
    const {
      params: { episodeId, assessmentId, assessmentType },
      user,
    } = req

    const [ok, predictors] = await getDraftPredictorScore(episodeId, user?.token, user?.id)
    if (!ok) return res.render('app/error', { error: new Error('Failed to complete the assessment') })

    logger.info(`Received ${predictors.length} predictor scores for episode: ${episodeId}`)

    const { previousPage } = req.session.navigation
    const offenderName = res.locals.offenderDetails?.name || 'Offender'

    return res.render(`${__dirname}/index`, {
      predictorScores: splitPredictorScores(predictors),
      heading: `${offenderName}'s scores`,
      subheading: getSubheadingFor(assessmentType),
      navigation: {
        previous: previousPage,
        complete: { url: `/${assessmentId}/episode/${episodeId}/${assessmentType}/scores/complete` },
      },
    })
  } catch (error) {
    logger.info(`Failed to display predictor scores - ${error.message} ${error.stack}`)
    return res.render('app/error', { error })
  }
}

module.exports = { displayPredictorScores }
