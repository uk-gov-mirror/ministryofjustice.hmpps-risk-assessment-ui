const superagent = require('superagent')
const logger = require('../logging/logger')
const { getCorrelationId } = require('../utils/util')
const { getCachedUserDetails } = require('./userDetailsCache')
const { ServerError } = require('../utils/errors')
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

const getAssessmentQuestions = (assessmentSchemaCode, authorisationToken, userId) => {
  const path = `${url}/assessments/schema/${assessmentSchemaCode}`
  return getData(path, authorisationToken, userId)
}

const getQuestionGroupSummary = (groupId, authorisationToken, userId) => {
  const path = `${url}/questions/${groupId}/summary`
  return getData(path, authorisationToken, userId)
}

const getFlatAssessmentQuestions = (assessmentCode, authorisationToken, userId) => {
  const path = `${url}/assessments/schema/${assessmentCode}/questions`
  return getData(path, authorisationToken, userId)
}

const getAssessmentSummary = (assessmentSchemaCode, authorisationToken, userId) => {
  const path = `${url}/assessments/schema/${assessmentSchemaCode}/summary`
  return getData(path, authorisationToken, userId)
}

const getAnswers = (assessmentId, episodeId, authorisationToken, userId) => {
  const path = `${url}/assessments/${assessmentId}/episodes/${episodeId}`
  return getData(path, authorisationToken, userId)
}

const getEpisode = (assessmentId, episodeId, authorisationToken, userId) => {
  const path = `${url}/assessments/${assessmentId}/episodes/${episodeId}`
  return getData(path, authorisationToken, userId)
}

const getCurrentEpisode = (assessmentId, authorisationToken, userId) => {
  const path = `${url}/assessments/${assessmentId}/episodes/current`
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
  const path = `${url}/assessments/${assessmentId}/episodes/${episodeId}/table/${tableName}`
  return postData(path, authorisationToken, userId, answers)
}

const deleteTableRow = (assessmentId, episodeId, tableName, tableRow, authorisationToken, userId) => {
  const path = `${url}/assessments/${assessmentId}/episodes/${episodeId}/table/${tableName}/${tableRow}`
  return deleteData(path, authorisationToken, userId)
}

const updateTableRow = (assessmentId, episodeId, tableName, tableRow, answers, authorisationToken, userId) => {
  const path = `${url}/assessments/${assessmentId}/episodes/${episodeId}/table/${tableName}/${tableRow}`
  return putData(path, authorisationToken, userId, answers)
}

const getDraftPredictorScore = (episodeUuid, authorisationToken, userId) => {
  const path = `${url}/risks/predictors/episodes/${episodeUuid}?final=false`
  logger.info(`Calling hmppsAssessments API with GET: ${path}`)

  return action(superagent.get(path), authorisationToken, userId)
}

const getRegistrationsForCrn = (crn, authorisationToken, userId) => {
  const path = `${url}/assessments/${crn}/registrations`
  logger.info(`Calling hmppsAssessments API with GET: ${path}`)

  return action(superagent.get(path), authorisationToken, userId)
}

const getRoshRiskSummaryForCrn = (crn, authorisationToken, userId) => {
  const path = `${url}/assessments/${crn}/ROSH/summary`
  logger.info(`Calling hmppsAssessments API with GET: ${path}`)

  return action(superagent.get(path), authorisationToken, userId)
}

const getFilteredReferenceData = (assessmentId, episodeId, questionCode, parentList, authorisationToken, userId) => {
  const path = `${url}/referencedata/filtered`
  const requestBody = {
    assessmentUuid: assessmentId,
    episodeUuid: episodeId,
    fieldName: questionCode,
    parentList,
  }
  return postData(path, authorisationToken, userId, requestBody)
}

const uploadPdfDocumentToDelius = async (assessmentUuid, episodeUuid, pdf, user) => {
  if (user.token === undefined) {
    throw new Error('No authorisation token found when calling hmppsAssessments API')
  }

  const endpoint = `/assessments/${assessmentUuid}/episode/${episodeUuid}/document`

  logger.info(`Calling hmppsAssessments API with POST: ${endpoint}`)

  const userDetails = await getCachedUserDetails(user.id)
  try {
    return await superagent
      .post(url + endpoint)
      .auth(user.token, { type: 'bearer' })
      .set('x-correlation-id', getCorrelationId())
      .set('x-user-area', userDetails?.areaCode || '')
      .accept('application/json')
      .attach('fileData', pdf.document, pdf.fieldName)
      .then(({ ok, body, status }) => ({ ok, response: body, status }))
  } catch (e) {
    const { response, status } = e
    return { ok: false, response, status }
  }
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

const putData = (path, authorisationToken, userId, data) => {
  logger.info(`Calling hmppsAssessments API with PUT: ${path}`)

  return action(superagent.put(path).send(data), authorisationToken, userId)
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
      .set('x-user-area', cachedDetails?.areaCode || '')
      .timeout(timeout)
      .then(response => {
        return [true, response.body]
      })
  } catch (error) {
    logError(error)
    const { status, response } = error
    if (status === 400 || status === 403 || status === 422) {
      return [false, response.body]
    }

    if (status >= 500) {
      throw new ServerError()
    }

    throw error
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
}

module.exports = {
  assessmentSupervision,
  getOffenderData,
  getAssessmentQuestions,
  getAnswers,
  getAssessmentsList,
  postAnswers,
  getQuestionGroupSummary,
  getAssessmentSummary,
  postCompleteAssessment,
  getFilteredReferenceData,
  postTableRow,
  deleteTableRow,
  updateEditedTableRow: updateTableRow,
  getFlatAssessmentQuestions,
  getDraftPredictorScore,
  getEpisode,
  getCurrentEpisode,
  getRegistrationsForCrn,
  getRoshRiskSummaryForCrn,
  uploadPdfDocumentToDelius,
}
