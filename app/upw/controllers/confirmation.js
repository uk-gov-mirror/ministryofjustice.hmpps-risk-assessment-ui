/* eslint-disable class-methods-use-this */
const nunjucks = require('nunjucks')
const SaveAndContinue = require('./saveAndContinue')
const logger = require('../../../common/logging/logger')
const { postCompleteAssessmentEpisode } = require('../../../common/data/hmppsAssessmentApi')
const { convertHtmlToPdf } = require('../../../common/data/pdf')
const { S3 } = require('../../../common/data/aws')
const { createDocumentId } = require('../../../common/utils/util')

const generatePdf = async (req, res) => {
  const renderedHtml = nunjucks.render('app/upw/templates/pdf-preview-and-declaration/pdf.njk', {
    ...res.locals,
    css_path: 'application.min.css',
  })

  const episodeId = req.session?.assessment?.episodeUuid

  const pdfConvertResponse = await convertHtmlToPdf(renderedHtml)

  if (!pdfConvertResponse.ok) {
    logger.error(`Failed to convert template to PDF, status=${pdfConvertResponse.status}`)
    throw new Error('Failed to generate the PDF')
  }

  return { key: createDocumentId(episodeId), file: pdfConvertResponse.response }
}

const uploadToS3 = async ({ key, file }) => {
  const s3 = new S3()
  const s3UploadResponse = await s3.upload(key, file)

  if (!s3UploadResponse.ok) {
    throw new Error('Failed to upload the PDF')
  }
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
    throw new Error('Failed to complete the assessment')
  }
}

class Confirmation extends SaveAndContinue {
  async render(req, res, next) {
    try {
      await generatePdf(req, res)
        .then(uploadToS3)
        .then(() => completeAssessment(req, res))

      return super.render(req, res, next)
    } catch (e) {
      return next(e)
    }
  }
}

module.exports = Confirmation
