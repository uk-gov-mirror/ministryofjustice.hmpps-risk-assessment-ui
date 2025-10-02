import { createClient } from 'redis'
import { redis as _redis } from '../config'
import logger from '../logging/logger'

const url = _redis.tls_enabled ? `rediss://${_redis.host}:${_redis.port}` : `redis://${_redis.host}:${_redis.port}`

const redisClient = createClient({
  url,
  password: _redis.password,
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

export const client = redisClient
export const get = getAsync
export const set = setAsync
