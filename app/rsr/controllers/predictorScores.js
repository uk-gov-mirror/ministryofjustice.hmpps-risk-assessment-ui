const { Controller } = require('hmpo-form-wizard')
const { getDraftPredictorScore, postCompleteAssessment } = require('../../../common/data/hmppsAssessmentApi')
const logger = require('../../../common/logging/logger')
const { splitPredictorScores } = require('../../../common/utils/predictors')

const getErrorMessage = reason => {
  if (reason === 'OASYS_PERMISSION') {
    return 'You do not have permission to complete this type of assessment. Speak to your manager and ask them to request a change to your level of authorisation.'
  }

  return 'Something went wrong'
}

class PredictorScores extends Controller {
  // eslint-disable-next-line consistent-return
  async locals(req, res, next) {
    res.locals.csrfToken = res.locals['csrf-token'] // TODO: move this to a BaseController class
    res.locals.assessment = req.session.assessment

    const { user } = req

    const episodeId = req.session.assessment?.episodeUuid
    if (!episodeId)
      return res.render('app/error', {
        error: new Error('Could not find episode identifier when getting draft predictor scores'),
      })
    const [ok, predictors] = await getDraftPredictorScore(episodeId, user?.token, user?.id)
    if (!ok) return res.render('app/error', { error: new Error('Failed to get draft predictor scores') })

    logger.info(`Received ${predictors.length} predictor scores for episode: ${episodeId}`)

    // debugging
    logger.info(predictors)

    res.locals.predictorScores = splitPredictorScores(predictors)
    res.locals.scoreType = predictors[0].scoreType

    res.locals.heading = `Scores for ${req.session.assessment?.subject?.name || ' the offender'}`
    return super.locals(req, res, next)
  }

  async saveValues(req, res, next) {
    try {
      const [ok, response] = await postCompleteAssessment(req.session.assessment?.uuid, req.user?.token, req.user?.id)

      if (!ok) return res.render('app/error', { subHeading: getErrorMessage(response.reason) })
    } catch (error) {
      logger.error(`Could not complete assessment ${req.session.assessment?.uuid}, error: ${error}`)
      return res.render('app/error', { error })
    }

    return super.saveValues(req, res, next)
  }
}

module.exports = PredictorScores
