const { logger } = require('../logging/logger')
const { REFRESH_TOKEN_LIFETIME_SECONDS } = require('../utils/constants')
const redis = require('./redis')

const LOCAL_CACHE = 'localCache'

const applyBackendBusinessRules = (answers) => {
  const updatedAnswers = JSON.parse(JSON.stringify(answers)) // deep clone

  if (Array.isArray(answers.gender_identity) && answers.gender_identity.includes('MALE')) {
    delete updatedAnswers.placement_preference
    delete updatedAnswers.placement_preferences
    delete updatedAnswers.placement_preference_complete
  }

  return updatedAnswers
}

// Simple mock for how the backend API handles answer updates
const mockPostAnswers = async (updatedAnswers) => {
  try {
    const previousAnswers = (await redis.get(LOCAL_CACHE)) || '{}'
    const answers = { ...JSON.parse(previousAnswers), ...updatedAnswers.answers }
    await redis.set(
      LOCAL_CACHE,
      JSON.stringify(applyBackendBusinessRules(answers)),
      'EX',
      REFRESH_TOKEN_LIFETIME_SECONDS,
    )
    return [true, { answers }]
  } catch (e) {
    logger.info(e)
    return [false, { status: 500 }]
  }
}

module.exports = {
  mockPostAnswers,
}
