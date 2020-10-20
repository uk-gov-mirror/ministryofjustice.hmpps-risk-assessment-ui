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
  logger.warn(error)
  throw error
}

module.exports = {
  getJwtToken,
}
