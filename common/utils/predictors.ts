import { DateTime } from 'luxon'

const formatDate = (isoString) => {
  const datePart = 'd MMM y'
  const timePart = 'HH:mm:ss'
  const pattern = `${datePart} 'at' ${timePart}`
  return DateTime.fromISO(isoString, { zone: 'utc' }).setLocale('en-GB').setZone('Europe/London').toFormat(pattern)
}

const displayPredictorLevels = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  VERY_HIGH: 'VERY HIGH',
  NOT_APPLICABLE: 'NOT APPLICABLE',
}

const displayPredictorTypes = { RSR: 'RSR', OSPC: 'OSP/C', OSPI: 'OSP/I' }

export const splitPredictorScores = (predictorScores) => {
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
