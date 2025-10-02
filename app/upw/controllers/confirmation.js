import { render as _render } from 'nunjucks'
import SaveAndContinue from './saveAndContinue'
import logger from '../../../common/logging/logger'
import { postCompleteAssessmentEpisode } from '../../../common/data/hmppsAssessmentApi'
import { convertHtmlToPdf } from '../../../common/data/pdf'
import { S3 } from '../../../common/data/aws/s3'
import { SNS } from '../../../common/data/aws/sns'
import { createDocumentId } from '../../../common/utils/util'
import { upwComplete } from '../../../common/data/sns-messages'

const generateDocument = async (req, res) => {
  const renderedHtml = _render('app/upw/templates/pdf-preview-and-declaration/pdf.njk', {
    ...res.locals,
    notification: { isVisible: false },
    cssPath: 'application.min.css',
  })

  const episodeId = req.session?.assessment?.episodeUuid

  const pdfConvertResponse = await convertHtmlToPdf(renderedHtml)

  if (!pdfConvertResponse.ok) {
    logger.error(`Failed to convert template to PDF, status=${pdfConvertResponse.status}`)
    throw new Error('Failed to generate the PDF')
  }

  return { key: createDocumentId(episodeId), file: pdfConvertResponse.body, type: 'application/pdf' }
}

const uploadDocument = async ({ key, file, type }) => {
  const s3 = new S3()
  const s3UploadResponse = await s3.upload(key, file, type)

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

export default Confirmation
