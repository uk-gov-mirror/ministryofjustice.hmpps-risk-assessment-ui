import { set, get } from './redis'
import { REFRESH_TOKEN_LIFETIME_SECONDS } from '../utils/constants'

export const cacheUserDetails = async (user) => {
  const userDetails = {
    username: user?.user_name,
    name: user?.name,
  }

  await set(`user:${user?.user_id}`, JSON.stringify(userDetails), 'EX', REFRESH_TOKEN_LIFETIME_SECONDS)

  return userDetails
}

export const getCachedUserDetails = async (userId) => {
  const serializedDetails = await get(`user:${userId}`)
  return serializedDetails !== null ? JSON.parse(serializedDetails) : null
}
