const superagent = require('superagent')
const logger = require('../logging/logger')
const {
  apiClientId,
  apiClientSecret,
  apis: {
    oauth: { timeout, url },
  },
} = require('../config')
const redis = require('./redis')
const { SIXTY_SECONDS } = require('../utils/constants')

const checkTokenIsActive = async token => {
  return superagent
    .post(`${url}/token/verify`)
    .auth(token, { type: 'bearer' })
    .timeout(timeout)
    .then(response => response.body && response.body.active)
    .catch(error => {
      logger.error(`Unable to verify token: ${error.message}`)
    })
}

const getUserEmail = async token => {
  return superagent
    .get(`${url}/api/me/email`)
    .auth(token, { type: 'bearer' })
    .timeout(timeout)
    .then(response => {
      return response.body?.email
    })
    .catch(error => {
      logger.error(`Unable to get user email: ${error.message}`)
    })
}

const getApiToken = async () => {
  logger.info('Getting API bearer token')
  try {
    const cachedToken = await redis.get('ui:apiToken')

    if (cachedToken) {
      return cachedToken
    }

    logger.info('API bearer token not found in cache - fetching a new one')

    return await superagent
      .post(`${url}/oauth/token?grant_type=client_credentials`)
      .send()
      .auth(apiClientId, apiClientSecret)
      .timeout(timeout)
      .then(response => {
        const { access_token: token, expires_in: expiresIn } = response.body
        redis.set('ui:apiToken', token, 'EX', expiresIn - SIXTY_SECONDS)
        return token
      })
  } catch (error) {
    return logError(error)
  }
}

const logError = error => {
  logger.warn('Error calling authentication API')
  logger.warn({
    status: error.status,
    method: error.response?.req?.method,
    url: error.response?.req?.url,
    text: error.response?.text,
  })
  throw error
}

module.exports = {
  getApiToken,
  getUserEmail,
  checkTokenIsActive,
}
