const { format, parseISO } = require('date-fns')
const { postCompleteAssessment } = require('../../common/data/hmppsAssessmentApi')
const logger = require('../../common/logging/logger')

const formatDate = dateString => {
  const date = parseISO(dateString)
  const datePart = format(date, 'd MMM y')
  const timePart = format(date, 'HH:mm:ss')
  return `${datePart} at ${timePart}`
}

const removeSpecialCharactersFrom = string => string.replace(/[^a-zA-Z]/g, '')

const splitPredictorScores = predictorScores => {
  const formattedScores = Object.entries(predictorScores).reduce((previous, [type, { level, score, date }]) => {
    const updated = { ...previous, date: formatDate(date) }
    const key = removeSpecialCharactersFrom(type)

    updated.scores = {
      ...(updated.scores || {}),
      [key]: { level, score, type },
    } // 🤔

    return updated
  }, {})

  return {
    current: formattedScores,
    historical: [], // TODO: 👈 Add some code to do these
  }
}

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

    const [ok, assessment] = await postCompleteAssessment(assessmentId, user?.token, user?.id)
    if (!ok) return res.render('app/error', { error: new Error('Failed to complete the assessment') })

    if (!assessment.predictors) {
      return res.render('app/error', { error: new Error('Failed to get predictor scores') })
    }

    logger.info(`Received ${assessment.predictors.length} predictor scores for episode: ${episodeId}`)

    const { previousPage } = req.session.navigation
    const offenderName = res.locals.offenderDetails?.name || 'Offender'

    return res.render(`${__dirname}/index`, {
      predictorScores: splitPredictorScores(assessment.predictors),
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
