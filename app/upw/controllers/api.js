const nunjucks = require('nunjucks')
const { S3 } = require('../../../common/data/aws/s3')
const { getOffenderData, getEpisode } = require('../../../common/data/hmppsAssessmentApi')
const { getApiToken } = require('../../../common/data/oauth')
const { createDocumentId } = require('../../../common/utils/util')
const { withAnswersFrom, answersByQuestionCode } = require('../../common/controllers/saveAndContinue.utils')
const { fields } = require('../fields')
const { getRegistrations, getRoshRiskSummary } = require('./common.utils')

const { convertHtmlToPdf } = require('../../../common/data/pdf')
const { logger } = require('../../../common/logging/logger')

const fetchWidgetData = async (crn, eventId, token) => {
  const deliusRegistrations = await getRegistrations(crn, eventId, { token })
  const { roshRiskSummary } = await getRoshRiskSummary(crn, { token })

  return {
    ...deliusRegistrations,
    roshRiskSummary,
  }
}

const fetchTemplateData = async (episodeId) => {
  const token = await getApiToken()
  const episode = await getEpisode(episodeId, token) // need to update API, no reason to send both episode ID and assessment ID
  const subject = await getOffenderData(episode.assessmentUuid, token)
  const offence = episode.offence || {}
  const persistedAnswers = episode.answers || {}
  const widgetData = await fetchWidgetData(subject.crn, offence.eventId, token)
  const questions = Object.entries(fields)

  const questionsWithMappedAnswers = questions.map(withAnswersFrom({}, persistedAnswers))
  const answers = questionsWithMappedAnswers.reduce(answersByQuestionCode, {})

  return {
    assessment: { offence },
    answers,
    persistedAnswers,
    widgetData,
    userFullName: episode?.userFullName || 'Unknown',
  }
}

const sendDocumentResponse = (res, document) => {
  res
    .status(200)
    .set('Content-Type', 'application/pdf')
    .set('Content-Length', document.length)
    .set('Content-Disposition', 'attachment; filename="upw-assessment.pdf"')
    .send(document)
}

const streamDocumentResponse = (res, document) => {
  res
    .status(200)
    .set('Content-Type', 'application/pdf')
    .set('Content-Disposition', 'attachment; filename="upw-assessment.pdf"')

  document.pipe(res)
}

const generatePdf = (res) => async (templateData) => {
  const rendered = nunjucks.render('app/upw/templates/pdf-preview-and-declaration/pdf.njk', {
    ...templateData,
    css_path: 'application.min.css',
  })

  const response = await convertHtmlToPdf(rendered)

  if (response.ok) {
    return sendDocumentResponse(res, response.body)
  }

  return res.status(500).send()
}

const downloadUpwPdf = async (req, res, next) => {
  try {
    const { episodeId } = req.params
    logger.info(`Fetching PDF for episode: ${episodeId}`)

    if (!episodeId) {
      return res.status(400).send()
    }

    const s3 = new S3()
    const response = await s3.fetch(createDocumentId(episodeId))

    if (response.ok) {
      logger.info(`Returning PDF from S3 for episode: ${episodeId}`)
      return streamDocumentResponse(res, response.body)
    }
    if (response.error?.statusCode === 404) {
      logger.info(`Returning generated PDF for episode: ${episodeId}`)
      return fetchTemplateData(episodeId).then(generatePdf(res))
    }

    return res.status(response.error?.statusCode || 500).send()
  } catch (e) {
    return next(e)
  }
}

module.exports = {
  downloadUpwPdf,
}
