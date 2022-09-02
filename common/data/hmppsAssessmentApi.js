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

const getOffenderAndOffenceDetails = (crn, eventId, assessmentCode, eventType, authorisationToken, userId) => {
  const path =
    eventType === null
      ? `${url}/offender/crn/${crn}/eventId/${eventId}`
      : `${url}/offender/crn/${crn}/eventType/${eventType}/eventId/${eventId}`
  return getData(path, authorisationToken, userId)
}

// this endpoint creates the assessment
const assessmentSupervision = (assessmentDto, authorisationToken, userId) => {
  const path = `${url}/assessments`
  return postData(path, authorisationToken, userId, assessmentDto)
}

const getOffenderData = (uuid, authorisationToken, userId) => {
  const path = `${url}/assessments/${uuid}/subject`
  return getData(path, authorisationToken, userId)
}

const getFlatAssessmentQuestions = (assessmentCode, authorisationToken, userId) => {
  const path = `${url}/assessments/${assessmentCode}/questions`
  return getData(path, authorisationToken, userId)
}

const getAssessmentSummary = (assessmentSchemaCode, authorisationToken, userId) => {
  const path = `${url}/assessments/${assessmentSchemaCode}/summary`
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

const getCurrentEpisodeForCrn = (crn, authorisationToken, userId) => {
  const path = `${url}/assessments/subject/${crn}/episodes/current`
  return getData(path, authorisationToken, userId)
}

const getAssessmentsList = (authorisationToken, userId) => {
  const path = `${url}/questions/list`
  return getData(path, authorisationToken, userId)
}

// this endpoint is now deprecated - use postCompleteAssessmentEpisode below which is idempotent
const postCompleteAssessment = (assessmentId, authorisationToken, userId) => {
  const path = `${url}/assessments/${assessmentId}/complete`
  return postData(path, authorisationToken, userId)
}

const postCompleteAssessmentEpisode = (assessmentId, episodeId, authorisationToken, userId) => {
  const path = `${url}/assessments/${assessmentId}/episodes/${episodeId}/complete`
  return postData(path, authorisationToken, userId)
}

const postAnswers = (assessmentId, episodeId, answers, authorisationToken, userId) => {
  const path = `${url}/assessments/${assessmentId}/episodes/${episodeId}`
  logger.debug(`posting answers: ${JSON.stringify(answers)}`)
  return postData(path, authorisationToken, userId, answers)
}

const closeAssessment = (assessmentId, episodeId, user) => {
  const path = `${url}/assessments/${assessmentId}/episodes/${episodeId}/close`

  logger.info(`Calling hmppsAssessments API with GET: ${path}`)
  return action(superagent.get(path), user?.token, user?.id)
}

const getDraftPredictorScore = (episodeUuid, authorisationToken, userId) => {
  const path = `${url}/risks/predictors/episodes/${episodeUuid}?final=false`
  logger.info(`Calling hmppsAssessments API with GET: ${path}`)

  return action(superagent.get(path), authorisationToken, userId)
}

const getRegistrationsForCrn = async (crn, user) => {
  const endpoint = `${url}/assessments/${crn}/registrations`

  logger.info(`Calling hmppsAssessments API with GET: ${endpoint}`)

  const userDetails = await getCachedUserDetails(user.id)

  try {
    return await superagent
      .get(endpoint)
      .auth(user.token, { type: 'bearer' })
      .set('x-correlation-id', getCorrelationId())
      .set('x-user-area', userDetails?.areaCode || '')
      .accept('application/json')
      .then(({ ok, body, status }) => ({ ok, response: body, status }))
  } catch (e) {
    logError(e)
    const { response, status } = e
    return { ok: false, response, status }
  }
}

const getRoshRiskSummaryForCrn = async (crn, user) => {
  const endpoint = `${url}/assessments/${crn}/ROSH/summary`

  if (user.token === undefined) {
    throw new Error('No authorisation token found when calling hmppsAssessments API')
  }

  logger.info(`Calling hmppsAssessments API with GET: ${endpoint}`)

  const userDetails = await getCachedUserDetails(user.id)

  try {
    return await superagent
      .get(endpoint)
      .auth(user.token, { type: 'bearer' })
      .set('x-correlation-id', getCorrelationId())
      .set('x-user-area', userDetails?.areaCode || '')
      .accept('application/json')
      .then(({ ok, body, status }) => ({ ok, response: body, status }))
  } catch (e) {
    logError(e)
    const { response, status } = e
    return { ok: false, response, status }
  }
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
      .attach('fileData', pdf.document, pdf.fileName)
      .then(({ ok, body, status }) => ({ ok, response: body, status }))
  } catch (e) {
    logError(e)
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
      .then((response) => {
        return [true, response.body]
      })
  } catch (error) {
    logError(error)
    const { status, response } = error
    if (status === 400 || status === 403 || status === 422 || (agent.method !== 'POST' && status === 404)) {
      return [false, response.body]
    }

    if (status >= 500) {
      throw new ServerError()
    }

    throw error
  }
}

const logError = (error) => {
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
  getAnswers,
  getAssessmentsList,
  postAnswers,
  getAssessmentSummary,
  postCompleteAssessment,
  getFlatAssessmentQuestions,
  getDraftPredictorScore,
  getEpisode,
  getCurrentEpisode,
  getCurrentEpisodeForCrn,
  getRegistrationsForCrn,
  getRoshRiskSummaryForCrn,
  uploadPdfDocumentToDelius,
  closeAssessment,
  getOffenderAndOffenceDetails,
  postCompleteAssessmentEpisode,
}
