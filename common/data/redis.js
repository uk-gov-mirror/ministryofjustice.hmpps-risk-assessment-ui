const redis = require('redis')
const { promisify } = require('util')
const config = require('../config')

const redisClient = redis.createClient({
  port: config.redis.port,
  password: config.redis.password,
  host: config.redis.host,
  tls: config.redis.tls_enabled === 'true' ? {} : false,
})

const getAsync = promisify(redisClient.get).bind(redisClient)
const setAsync = promisify(redisClient.set).bind(redisClient)

module.exports = {
  client: redisClient,
  get: getAsync,
  set: setAsync,
}
