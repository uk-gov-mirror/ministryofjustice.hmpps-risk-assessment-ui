/* eslint-disable class-methods-use-this */
const nunjucks = require('nunjucks')
const SaveAndContinue = require('./saveAndContinue')
const logger = require('../../../common/logging/logger')
const { postCompleteAssessmentEpisode } = require('../../../common/data/hmppsAssessmentApi')
const { convertHtmlToPdf } = require('../../../common/data/pdf')
const { S3 } = require('../../../common/data/aws/s3')
const { SNS } = require('../../../common/data/aws/sns')
const { createDocumentId } = require('../../../common/utils/util')
const { upwComplete } = require('../../../common/data/sns-messages')

const generateDocument = async (req, res) => {
  const renderedHtml = nunjucks.render('app/upw/templates/pdf-preview-and-declaration/pdf.njk', {
    ...res.locals,
    notification: { isVisible: false },
    css_path: 'application.min.css',
  })

  const episodeId = req.session?.assessment?.episodeUuid

  const pdfConvertResponse = await convertHtmlToPdf(renderedHtml)

  if (!pdfConvertResponse.ok) {
    logger.error(`Failed to convert template to PDF, status=${pdfConvertResponse.status}`)
    throw new Error('Failed to generate the PDF')
  }

  return { key: createDocumentId(episodeId), file: pdfConvertResponse.body }
}

const uploadDocument = async ({ key, file }) => {
  const s3 = new S3()
  const s3UploadResponse = await s3.upload(key, file)

  if (!s3UploadResponse.ok) {
    throw new Error('Failed to upload the PDF')
  }
}

const publishEvent = (req) => async () => {
  const { assessment } = req.session

  if (!assessment?.episodeUuid || !assessment?.subject?.crn) {
    throw new Error('Failed to get assessment details')
  }

  const sns = new SNS()

  const snsResponse = await sns.publishJson(
    upwComplete(assessment.episodeUuid, assessment.subject.crn, assessment.eventId),
  )

  if (!snsResponse.ok) {
    throw new Error('Failed to publish "UPW Complete" event')
  }
}

const completeAssessment = (req) => async () => {
  const { assessment } = req.session

  const assessmentId = assessment?.uuid
  const episodeId = assessment?.episodeUuid
  const crn = assessment?.subject.crn || ''

  const [assessmentCompleted, episode] = await postCompleteAssessmentEpisode(assessmentId, episodeId, req.user?.token)

  req.session.assessment.isComplete = episode?.ended != null
  req.session.save()

  if (!assessmentCompleted) {
    logger.error(`Could not close assessment: ${assessmentId} for CRN: ${crn}`)
    throw new Error('Failed to complete the assessment')
  }
}

class Confirmation extends SaveAndContinue {
  async render(req, res, next) {
    try {
      const { assessment } = req.session

      if (!assessment?.episodeUuid || !assessment?.subject?.crn) {
        return next(new Error('Failed to get assessment details'))
      }

      if (!assessment.isComplete) {
        await generateDocument(req, res).then(uploadDocument).then(publishEvent(req)).then(completeAssessment(req))
      }

      return super.render(req, res, next)
    } catch (e) {
      return next(e)
    }
  }
}

module.exports = Confirmation
