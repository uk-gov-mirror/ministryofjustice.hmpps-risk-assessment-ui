const superagent = require('superagent')
const logger = require('../logging/logger')
const { getCorrelationId } = require('../utils/util')
const { getCachedUserDetails } = require('./userDetailsCache')
const {
  apis: {
    hmppsAssessments: { timeout, url },
  },
} = require('../config')

const assessmentSupervision = (assessmentDto, authorisationToken, userId) => {
  const path = `${url}/assessments`
  return postData(path, authorisationToken, userId, assessmentDto)
}

const getOffenderData = (uuid, authorisationToken, userId) => {
  const path = `${url}/assessments/${uuid}/subject`
  return getData(path, authorisationToken, userId)
}

const getQuestionGroup = (groupId, authorisationToken, userId) => {
  const path = `${url}/questions/${groupId}`
  return getData(path, authorisationToken, userId)
}

const getQuestionGroupSummary = (groupId, authorisationToken, userId) => {
  const path = `${url}/questions/${groupId}/summary`
  return getData(path, authorisationToken, userId)
}

const getAnswers = (assessmentId, episodeId, authorisationToken, userId) => {
  const path = `${url}/assessments/${assessmentId}/episodes/${episodeId}`
  return getData(path, authorisationToken, userId)
}

const getAssessmentsList = (authorisationToken, userId) => {
  const path = `${url}/questions/list`
  return getData(path, authorisationToken, userId)
}

const postCompleteAssessment = (assessmentId, authorisationToken, userId) => {
  const path = `${url}/assessments/${assessmentId}/complete`
  return postData(path, authorisationToken, userId)
}

const postAnswers = (assessmentId, episodeId, answers, authorisationToken, userId) => {
  const path = `${url}/assessments/${assessmentId}/episodes/${episodeId}`
  return postData(path, authorisationToken, userId, answers)
}

const postTableRow = (assessmentId, episodeId, tableName, answers, authorisationToken, userId) => {
  const path = `${url}/assessments/${assessmentId}/episodes/${episodeId}/${tableName}`
  return postData(path, authorisationToken, userId, answers)
}

const deleteTableRow = (assessmentId, episodeId, tableName, tableRow, authorisationToken, userId) => {
  const path = `${url}/assessments/${assessmentId}/episodes/${episodeId}/${tableName}/${tableRow}`
  return deleteData(path, authorisationToken, userId)
}

const updateTableRow = (assessmentId, episodeId, tableName, answers, tableRow, authorisationToken, userId) => {
  const path = `${url}/assessments/${assessmentId}/episodes/${episodeId}/${tableName}/${tableRow}`
  return postData(path, authorisationToken, userId, answers)
}

const getFilteredReferenceData = (assessmentId, episodeId, questionUuid, parentList, authorisationToken, userId) => {
  const path = `${url}/referencedata/filtered`
  const requestBody = {
    assessmentUuid: assessmentId,
    episodeUuid: episodeId,
    fieldName: questionUuid,
    parentList,
  }
  return postData(path, authorisationToken, userId, requestBody)
}

const getData = (path, authorisationToken, userId) => {
  logger.info(`Calling hmppsAssessments API with GET: ${path}`)

  return action(superagent.get(path), authorisationToken, userId).then(([_, body]) => {
    return body
  })
}

const postData = (path, authorisationToken, userId, data) => {
  logger.info(`Calling hmppsAssessments API with POST: ${path}`)

  return action(superagent.post(path).send(data), authorisationToken, userId)
}

const deleteData = (path, authorisationToken, userId) => {
  logger.info(`Calling hmppsAssessments API with DELETE: ${path}`)

  return action(superagent.delete(path), authorisationToken, userId)
}

const action = async (agent, authorisationToken, userId) => {
  if (authorisationToken === undefined) {
    throw new Error('No authorisation token found when calling hmppsAssessments API')
  }

  try {
    const cachedDetails = await getCachedUserDetails(userId)
    return await agent
      .auth(authorisationToken, { type: 'bearer' })
      .set('x-correlation-id', getCorrelationId())
      .set('x-user-area', cachedDetails?.areaCode)
      .timeout(timeout)
      .then(response => {
        return [true, response.body]
      })
  } catch (error) {
    const { status, response } = error
    if (status === 422) {
      // unprocessable entity
      return [false, response.body]
    }

    return logError(error)
  }
}

const logError = error => {
  logger.warn('Error calling hmppsAssessments API')
  logger.warn({
    status: error.status,
    method: error.response?.req?.method,
    url: error.response?.req?.url,
    text: error.response?.text,
  })
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
  postCompleteAssessment,
  getFilteredReferenceData,
  postTableRow,
  deleteTableRow,
  updateEditedTableRow: updateTableRow,
}
