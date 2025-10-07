import logger from '../logging/logger'
import { REFRESH_TOKEN_LIFETIME_SECONDS } from '../utils/constants'
import { get, set } from './redis'

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
export const mockPostAnswers = async (updatedAnswers) => {
  try {
    const previousAnswers = (await get(LOCAL_CACHE)) || '{}'
    const answers = { ...JSON.parse(previousAnswers), ...updatedAnswers.answers }
    await set(LOCAL_CACHE, JSON.stringify(applyBackendBusinessRules(answers)), 'EX', REFRESH_TOKEN_LIFETIME_SECONDS)
    return [true, { answers }]
  } catch (e) {
    logger.info(e)
    return [false, { status: 500 }]
  }
}
