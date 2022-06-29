const superagent = require('superagent')
const logger = require('../logging/logger')
const { getCorrelationId } = require('../utils/util')
const { AuthenticationError, ServerError } = require('../utils/errors')
const {
  apis: {
    offenderAssessments: { timeout, url },
  },
} = require('../config')

const getUserProfile = (userCode, authorisationToken) => {
  const path = `${url}/authentication/user/${userCode}`
  return getData(path, authorisationToken)
}

const getReferenceDataListByCategory = (category, authorisationToken) => {
  const path = `${url}/referencedata/${category}`
  return getData(path, authorisationToken)
}

const getUserByEmail = async (email, authorisationToken) => {
  try {
    const path = `${url}/authentication/user/email`
    return await postData(path, authorisationToken, { email })
  } catch (error) {
    if (error.status === 404) {
      throw new AuthenticationError('OASys account not found')
    }
    throw new AuthenticationError('Unable to fetch OASys user details')
  }
}

const getData = (path, authorisationToken) => {
  logger.info(`Calling offenderAssessments API with GET: ${path}`)

  return action(superagent.get(path), authorisationToken).then(([_, body]) => body)
}

const postData = (path, authorisationToken, data) => {
  logger.info(`Calling offenderAssessments API with POST: ${path}`)

  return action(superagent.post(path).send(data), authorisationToken).then(([_, body]) => body)
}

const action = async (agent, authorisationToken) => {
  if (authorisationToken === undefined) {
    throw new Error('No authorisation token found when calling offenderAssessments API')
  }

  try {
    return await agent
      .auth(authorisationToken, { type: 'bearer' })
      .set('x-correlation-id', getCorrelationId())
      .timeout(timeout)
      .then((response) => {
        return [true, response.body]
      })
  } catch (error) {
    logError(error)
    const { status, response } = error
    if (status === 422) {
      // unprocessable entity
      return [false, response.body]
    }

    if (status >= 500) {
      throw new ServerError()
    }

    throw error
  }
}

const logError = (error) => {
  logger.warn('Error calling offenderAssessments API')
  logger.warn({
    status: error.status,
    method: error.response?.req?.method,
    url: error.response?.req?.url,
    text: error.response?.text,
  })
}

module.exports = {
  getReferenceDataListByCategory,
  getUserByEmail,
  getUserProfile,
}
