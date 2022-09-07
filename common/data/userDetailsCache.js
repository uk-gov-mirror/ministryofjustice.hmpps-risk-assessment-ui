const redis = require('./redis')
const { REFRESH_TOKEN_LIFETIME_SECONDS } = require('../utils/constants')

const cacheUserDetails = async (user) => {
  const userDetails = {
    username: user?.user_name,
    name: user?.name,
  }

  await redis.set(`user:${user?.user_id}`, JSON.stringify(userDetails), 'EX', REFRESH_TOKEN_LIFETIME_SECONDS)

  return userDetails
}

const getCachedUserDetails = async (userId) => {
  const serializedDetails = await redis.get(`user:${userId}`)
  return serializedDetails !== null ? JSON.parse(serializedDetails) : null
}

module.exports = {
  cacheUserDetails,
  getCachedUserDetails,
}
