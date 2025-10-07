import superagent from 'superagent'
import logger from '../logging/logger'
import { getCorrelationId } from '../utils/util'
import { ServerError, ForbiddenError } from '../utils/errors'
import * as config from '../config'
import { mockPostAnswers } from './localCache'

const {
  apis: {
    hmppsAssessments: { timeout, url },
  },
  dev: { useLocalCache },
} = config

export const getOffenderAndOffenceDetails = (crn, eventId, authorisationToken) => {
  const path = `${url}/offender/crn/${crn}/eventId/${eventId}`

  return getData(path, authorisationToken)
}

export const startAssessment = (assessmentDto, authorisationToken) => {
  const path = `${url}/assessments`
  return postData(path, authorisationToken, assessmentDto)
}

export const getOffenderData = (uuid, authorisationToken) => {
  const path = `${url}/assessments/${uuid}/subject`
  return getData(path, authorisationToken)
}

export const getQuestionsForAssessmentType = (assessmentCode, authorisationToken) => {
  const path = `${url}/assessments/${assessmentCode}/questions`
  return getData(path, authorisationToken)
}

export const getAnswers = (assessmentId, episodeId, authorisationToken) => {
  const path = `${url}/assessments/${assessmentId}/episodes/${episodeId}`
  return getData(path, authorisationToken)
}

export const getEpisode = (episodeId, authorisationToken) => {
  const path = `${url}/episode/${episodeId}`
  return getData(path, authorisationToken)
}

export const getCurrentEpisode = (assessmentId, authorisationToken) => {
  const path = `${url}/assessments/${assessmentId}/episodes/current`
  return getData(path, authorisationToken)
}

export const getCurrentEpisodeForCrn = (crn, authorisationToken) => {
  const path = `${url}/assessments/subject/${crn}/episodes/current`
  return getData(path, authorisationToken)
}

export const postCompleteAssessmentEpisode = (assessmentId, episodeId, authorisationToken) => {
  const path = `${url}/assessments/${assessmentId}/episodes/${episodeId}/complete`
  return postData(path, authorisationToken)
}

export const postAnswers = (assessmentId, episodeId, answers, authorisationToken) => {
  if (useLocalCache) {
    return mockPostAnswers(answers)
  }

  const path = `${url}/assessments/${assessmentId}/episodes/${episodeId}`
  logger.debug(`posting answers: ${JSON.stringify(answers)}`)
  return postData(path, authorisationToken, answers)
}

export const closeAssessment = (assessmentId, episodeId, user) => {
  const path = `${url}/assessments/${assessmentId}/episodes/${episodeId}/close`

  logger.info(`Calling hmppsAssessments API with GET: ${path}`)
  return action(superagent.get(path), user?.token)
}

export const getRegistrationsForCrn = async (crn, eventId, authorisationToken) => {
  const endpoint = `${url}/assessments/${crn}/event/${eventId}/registrations`

  logger.info(`Calling hmppsAssessments API with GET: ${endpoint}`)

  try {
    return await superagent
      .get(endpoint)
      .auth(authorisationToken, { type: 'bearer' })
      .set('x-correlation-id', getCorrelationId())
      .accept('application/json')
      .then(({ ok, body, status }) => ({ ok, response: body, status }))
  } catch (e) {
    logError(e)
    const { response, status } = e
    return { ok: false, response, status }
  }
}

export const getRoshRiskSummaryForCrn = async (crn, user) => {
  const endpoint = `${url}/assessments/${crn}/ROSH/summary`

  if (user.token === undefined) {
    throw new Error('No authorisation token found when calling hmppsAssessments API')
  }

  logger.info(`Calling hmppsAssessments API with GET: ${endpoint}`)

  try {
    return await superagent
      .get(endpoint)
      .auth(user.token, { type: 'bearer' })
      .set('x-correlation-id', getCorrelationId())
      .accept('application/json')
      .then(({ ok, body, status }) => ({ ok, response: body, status }))
  } catch (e) {
    logError(e)
    const { response, status } = e
    return { ok: false, response, status }
  }
}

const getData = (path, authorisationToken) => {
  logger.info(`Calling hmppsAssessments API with GET: ${path}`)

  return action(superagent.get(path), authorisationToken).then(([_, body]) => {
    return body
  })
}

const postData = (path, authorisationToken, data) => {
  logger.info(`Calling hmppsAssessments API with POST: ${path}`)

  return action(superagent.post(path).send(data), authorisationToken)
}

const action = async (request, authorisationToken) => {
  if (authorisationToken === undefined) {
    throw new Error('No authorisation token found when calling hmppsAssessments API')
  }

  try {
    return await request
      .auth(authorisationToken, { type: 'bearer' })
      .set('x-correlation-id', getCorrelationId())
      .timeout(timeout)
      .then((response) => {
        return [true, response.body]
      })
  } catch (error) {
    logError(error)
    const { status, response } = error
    if (status === 400 || status === 422 || (request.method !== 'POST' && status === 404)) {
      return [false, response.body]
    }

    if (status === 403) {
      throw new ForbiddenError()
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
