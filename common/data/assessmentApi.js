const superagent = require('superagent')
const logger = require('../logging/logger')
const { getCorrelationId } = require('../utils/util')
const {
  apis: {
    offenderAssessments: { timeout, url },
  },
} = require('../config')

const assessmentSupervision = (assessmentDto, tokens) => {
  const path = `${url}/assessments/supervision`
  return postData(path, tokens, assessmentDto)
}

const getOffenderData = (uuid, tokens) => {
  const path = `${url}/assessments/${uuid}/subject`
  return getData(path, tokens)
}

const getQuestionGroup = (groupId, tokens) => {
  const path = `${url}/questions/${groupId}`
  return getData(path, tokens)
}

const getQuestionGroupSummary = (groupId, tokens) => {
  const path = `${url}/questions/${groupId}/summary`
  return getData(path, tokens)
}

const getAnswers = (assessmentId, episodeId, tokens) => {
  const path = `${url}/assessments/${assessmentId}/episodes/${episodeId}`
  return getData(path, tokens)
}

const getAssessmentsList = tokens => {
  const path = `${url}/questions/list`
  return getData(path, tokens)
}

const postAnswers = (assessmentId, episodeId, answers, tokens) => {
  const path = `${url}/assessments/${assessmentId}/episodes/${episodeId}`
  return postData(path, tokens, answers)
}

const getData = (path, tokens) => {
  logger.info(`Calling offenderAssessments API with GET: ${path}`)

  return action(superagent.get(path), tokens)
}

const postData = (path, tokens, data) => {
  logger.info(`Calling offenderAssessments API with POST: ${path}`)

  return action(superagent.post(path).send(data), tokens)
}

const action = async (agent, { authorisationToken }) => {
  if (authorisationToken === undefined) {
    return logError('No authorisation token found when calling offenderAssessments API')
  }

  try {
    return await agent
      .auth(authorisationToken, { type: 'bearer' })
      .set('x-correlation-id', getCorrelationId())
      .timeout(timeout)
      .then(response => {
        return response.body
      })
  } catch (error) {
    return logError(error)
  }
}

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
  assessmentSupervision,
  getOffenderData,
  getQuestionGroup,
  getAnswers,
  getAssessmentsList,
  postAnswers,
  getQuestionGroupSummary,
}
