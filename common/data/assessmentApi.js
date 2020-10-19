const superagent = require('superagent')
const logger = require('../logging/logger')
const { clientId, clientSecret } = require('../config')
const { getCorrelationId } = require('../utils/util')
const {
  apis: {
    offenderAssessments: { timeout, url },
  },
} = require('../config')

const getQuestionGroup = (groupId, tokens) => {
  const path = `${url}/questions/${groupId}`
  return getData(path, tokens)
}

const getData = async (path, { authorisationToken }) => {
  if (authorisationToken === undefined) {
    return logError(`No authorisation token found when calling offenderAssessments API: ${path}`)
  }
  logger.info(`Calling offenderAssessments API with GET: ${path}`)
  try {
    return await superagent
      .get(path)
      .auth(clientId, clientSecret)
      .set('x-correlation-id', getCorrelationId())
      .timeout(timeout)
      .then(response => {
        return response.body
      })
  } catch (error) {
    return logError(error)
  }
}
// const postData = async (path, { authorisationToken }, data) => {
//   if (authorisationToken === undefined) {
//     return logError(`No authorisation token found when calling offenderAssessments API: ${path}`)
//   }
//   logger.info(`Calling offenderAssessments API with POST: ${path}`)
//   try {
//     return await superagent
//       .post(path)
//       .send(data)
//       .auth(authorisationToken, { type: 'bearer' })
//       .set('x-correlation-id', getCorrelationId())
//       .timeout(timeout)
//       .then(response => {
//         return response.body
//       })
//   } catch (error) {
//     return logError(error)
//   }
// }
//
// const putData = async (path, { authorisationToken }, data) => {
//   if (authorisationToken === undefined) {
//     return logError(`No authorisation token found when calling offenderAssessments API: ${path}`)
//   }
//   logger.info(`Calling offenderAssessments API with PUT: ${path}`)
//   try {
//     return await superagent
//       .put(path)
//       .send(data)
//       .auth(authorisationToken, { type: 'bearer' })
//       .set('x-correlation-id', getCorrelationId())
//       .timeout(timeout)
//       .then(response => {
//         return response.body
//       })
//   } catch (error) {
//     return logError(error)
//   }
// }

const logError = error => {
  logger.warn('Error calling offenderAssessments API')
  logger.warn(error)
  throw error
}

module.exports = {
  getQuestionGroup,
}
