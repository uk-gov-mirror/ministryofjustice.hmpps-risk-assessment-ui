const redis = require('./redis')
const { ONE_DAY } = require('../utils/constants')

const cachePredictorScoresForEpisode = async (episodeUuid, predictorScores) => {
  await redis.set(`predictors:${episodeUuid}`, JSON.stringify(predictorScores), 'EX', ONE_DAY)
}
const getPredictorScoresForEpisode = async episodeUuid => {
  const serializedScores = await redis.get(`predictors:${episodeUuid}`)
  return serializedScores !== null ? JSON.parse(serializedScores) : null
}

module.exports = {
  cachePredictorScoresForEpisode,
  getPredictorScoresForEpisode,
}
