const { format, parseISO } = require('date-fns')
const { getPredictorScoresForEpisode } = require('../../common/data/predictorScores')
const logger = require('../../common/logging/logger')

const formatDate = dateString => {
  const date = parseISO(dateString)
  const datePart = format(date, 'd MMM y')
  const timePart = format(date, 'H:mm')
  return `${datePart} at ${timePart}`
}

const removeSpecialCharactersFrom = string => string.replace(/[^a-zA-Z]/g, '')

const formatPredictorScores = predictorScores => ({
  ...predictorScores,
  date: formatDate(predictorScores.date),
})

const splitPredictorScores = predictorScores => {
  const groupedScores = predictorScores
    .flatMap(predictor =>
      predictor.scores.map(predictorScore => ({
        ...predictorScore,
        type: predictor.type,
      })),
    )
    .reduce((result, { level, score, type, date }) => {
      const scoreType = [removeSpecialCharactersFrom(type)]
      const groups = { ...result }
      groups[date] = {
        date,
        scores: {
          ...(result[date]?.scores || {}),
          [scoreType]: {
            level,
            score,
            type,
          },
        },
      }
      return groups
    }, {})

  const sortedScores = Object.values(groupedScores).sort((a, b) => (a.date > b.date ? -1 : 1))

  const [currentScores, ...historicalScores] = sortedScores

  const formattedScore = currentScores ? formatPredictorScores(currentScores) : null
  const formattedHistoricalScores = historicalScores.map(formatPredictorScores)
  return {
    current: formattedScore,
    historical: formattedHistoricalScores,
  }
}

const getSubheadingFor = assessmentType => {
  const subheadings = { RSR: 'Risk of Serious Recidivism (RSR) assessment' }
  return subheadings[assessmentType]
}

const displayPredictorScores = async (req, res) => {
  try {
    const {
      params: { episodeUuid, assessmentType },
    } = req

    logger.info(`Displaying predictor scores for episode: ${episodeUuid} of type: ${assessmentType}`)

    const predictorScores = await getPredictorScoresForEpisode(episodeUuid)

    const { previousPage } = req.session.navigation

    const offenderName = res.locals.offenderDetails?.name || 'Offender'

    return res.render(`${__dirname}/index`, {
      predictorScores: splitPredictorScores(predictorScores),
      heading: `${offenderName}'s scores`,
      subheading: getSubheadingFor(assessmentType),
      navigation: {
        previous: previousPage,
        complete: { url: `/episode/${episodeUuid}/${assessmentType}/scores/complete` },
      },
    })
  } catch (error) {
    return res.render('app/error', { error })
  }
}

module.exports = { displayPredictorScores }
