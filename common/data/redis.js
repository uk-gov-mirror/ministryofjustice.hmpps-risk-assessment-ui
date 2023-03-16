const redis = require('redis')
const config = require('../config')
const logger = require('../logging/logger')

const url = config.redis.tls_enabled
  ? `rediss://${config.redis.host}:${config.redis.port}`
  : `redis://${config.redis.host}:${config.redis.port}`

const redisClient = redis.createClient({
  url,
  password: config.redis.password,
  // legacyMode: true,
  socket: {
    reconnectStrategy: (attempts) => {
      // Exponential back off: 20ms, 40ms, 80ms..., capped to retry every 30 seconds
      const nextDelay = Math.min(2 ** attempts * 20, 30000)
      logger.info(`Retry Redis connection attempt: ${attempts}, next attempt in: ${nextDelay}ms`)
      return nextDelay
    },
  },
})

const getAsync = async (...args) => {
  const res = await redisClient.get(...args)

  return res
}
const setAsync = async (...args) => {
  await redisClient.set(...args)
}

module.exports = {
  client: redisClient,
  get: getAsync,
  set: setAsync,
}
