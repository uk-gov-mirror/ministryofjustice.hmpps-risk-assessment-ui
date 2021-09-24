const { parseISO, format } = require('date-fns')

const formatDate = dateString => {
  const date = parseISO(dateString)
  const datePart = format(date, 'd MMM y')
  const timePart = format(date, 'HH:mm:ss')
  return `${datePart} at ${timePart}`
}

const displayPredictorLevels = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  VERY_HIGH: 'VERY HIGH',
  NOT_APPLICABLE: 'NOT APPLICABLE',
}

const displayPredictorTypes = { RSR: 'RSR', OSPC: 'OSP/C', OSPI: 'OSP/I' }

const splitPredictorScores = predictorScores => {
  const formattedScores = predictorScores.reduce((acc, scores) => {
    return Object.entries(scores.scores).reduce((acc1, [type, { level, score, date }]) => {
      const updated = { ...acc1, date: formatDate(date) }
      updated.scores = {
        ...(updated.scores || {}),
        [type]: { level: displayPredictorLevels[level], score, type: displayPredictorTypes[type] },
      } // 🤔

      return updated
    }, {})
  }, {})

  return {
    current: formattedScores,
    historical: [], // TODO: 👈 Add some code to do these
  }
}

module.exports = { splitPredictorScores }
