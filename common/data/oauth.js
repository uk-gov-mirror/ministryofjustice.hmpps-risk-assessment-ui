const superagent = require('superagent')
const logger = require('../logging/logger')
const {
  clientId,
  clientSecret,
  apis: {
    oauth: { timeout, url },
  },
} = require('../config')

const getJwtToken = () => {
  return postData(`${url}/token?grant_type=client_credentials`)
}

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

const postData = async path => {
  logger.info(`Calling oauth API with POST: ${path}`)
  try {
    return await superagent
      .post(path)
      .send()
      .auth(clientId, clientSecret)
      .timeout(timeout)
      .then(response => {
        return response.body
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
  getJwtToken,
  checkTokenIsActive,
}
