/* eslint-disable class-methods-use-this */
const nunjucks = require('nunjucks')
const SaveAndContinue = require('./saveAndContinue')
const logger = require('../../../common/logging/logger')
const { uploadPdfDocumentToDelius, postCompleteAssessmentEpisode } = require('../../../common/data/hmppsAssessmentApi')
const { convertHtmlToPdf } = require('../../../common/data/pdf')

const createFileNameFrom = (type, ...parts) => {
  const fileName = parts
    .filter((s) => s !== '')
    .join('-')
    .toLowerCase()
  return `${fileName}.${type}`
}

const uploadPdf = async (req, res) => {
  const renderedHtml = nunjucks.render('app/upw/templates/pdf-preview-and-declaration/pdf.njk', {
    ...res.locals,
    css_path: 'application.min.css',
  })

  const firstName = res.locals.persistedAnswers.first_name || ''
  const familyName = res.locals.persistedAnswers.family_name || ''
  const crn = res.locals.persistedAnswers.crn || ''

  const assessmentId = req.session?.assessment?.uuid
  const episodeId = req.session?.assessment?.episodeUuid

  const fileName = createFileNameFrom('pdf', firstName, familyName, crn)

  const pdfConvertResponse = await convertHtmlToPdf(renderedHtml)

  if (!pdfConvertResponse.ok) {
    logger.error(`Failed to convert template to PDF, status=${pdfConvertResponse.status}`)
    return [new Error('Failed to convert template to PDF')]
  }

  const deliusUploadResponse = await uploadPdfDocumentToDelius(
    assessmentId,
    episodeId,
    { document: pdfConvertResponse.response, fileName },
    req.user,
  )

  if (!deliusUploadResponse.ok) {
    logger.error(`Failed to upload the PDF, status=${deliusUploadResponse.status}`)
    return [null, new Error('Failed to upload the PDF')]
  }

  logger.info(`PDF uploaded for CRN ${crn}, episode ${episodeId}`)

  return []
}

const completeAssessment = async (req, res) => {
  const assessmentId = req.session?.assessment?.uuid
  const episodeId = req.session?.assessment?.episodeUuid
  const crn = res.locals.persistedAnswers.crn || ''

  const [assessmentCompleted] = await postCompleteAssessmentEpisode(
    assessmentId,
    episodeId,
    req.user?.token,
    req.user?.id,
  )

  if (!assessmentCompleted) {
    logger.error(`Could not close assessment: ${assessmentId} for CRN: ${crn}`)
    return new Error('Failed to complete the assessment')
  }

  return null
}

class Confirmation extends SaveAndContinue {
  async render(req, res, next) {
    try {
      const [[failedToConvertPdf, failedToUploadPdf] = [], failedToComplete] = await Promise.all([
        uploadPdf(req, res),
        completeAssessment(req, res),
      ])

      if (failedToUploadPdf) {
        return res.redirect('/UPW/delius-error')
      }

      if (failedToConvertPdf || failedToComplete) {
        return next(failedToConvertPdf || failedToComplete)
      }

      return super.render(req, res, next)
    } catch (e) {
      return next(e)
    }
  }
}

module.exports = Confirmation
