const { Controller } = require('hmpo-form-wizard')
const nunjucks = require('nunjucks')

const ConfirmationController = require('./confirmation')
const pdfConverterClient = require('../../../common/data/pdf')
const hmppsAssessmentsApiClient = require('../../../common/data/hmppsAssessmentApi')
const { S3 } = require('../../../common/data/aws/s3')
const { SNS } = require('../../../common/data/aws/sns')

jest.mock('nunjucks')
jest.mock('../../../common/data/pdf')
jest.mock('../../../common/data/hmppsAssessmentApi')
jest.mock('../../../common/utils/util', () => ({
  getCorrelationId: jest.fn(() => 'mocked-correlation-id'),
  createDocumentId: jest.fn(() => 'documents/foo-document.pdf'),
}))
jest.mock('../../../common/data/userDetailsCache', () => ({
  getCachedUserDetails: jest.fn(() => ({
    isActive: true,
    oasysUserCode: 'SUPPORT1',
    username: 'Ray Arnold',
    email: 'foo@bar.baz',
    areaCode: 'HFS',
    areaName: 'Hertfordshire',
  })),
}))
jest.mock('../../../common/data/aws/s3')
jest.mock('../../../common/data/aws/sns')

const createTestFile = () => Buffer.from('Test Buffer')

describe('ConfirmationController', () => {
  describe('Render', () => {
    const superMethod = jest.spyOn(Controller.prototype, 'render')
    const controller = new ConfirmationController({
      route: 'test-route',
    })

    let req
    const user = { token: 'mytoken', id: '1' }
    const assessmentUuid = '22222222-2222-2222-2222-222222222221'
    const episodeUuid = '22222222-2222-2222-2222-222222222222'

    const res = {
      redirect: jest.fn(),
      render: jest.fn(),
      send: jest.fn(),
      set: jest.fn(),
      locals: {
        'csrf-token': 'CSRF_TOKEN',
        persistedAnswers: {
          first_name: 'Robert',
          last_name: 'Robertson',
          crn: 'X123456',
        },
      },
    }

    const next = jest.fn()

    beforeEach(() => {
      req = {
        user,
        body: {},
        sessionModel: {
          set: jest.fn(),
          get: jest.fn(),
        },
        session: {
          assessment: {
            uuid: assessmentUuid,
            episodeUuid,
            isComplete: false,
            subject: { crn: 'X123456', dob: '1980-01-01' },
          },
          save: jest.fn(),
        },
        form: {
          options: {
            allFields: {},
            fields: {},
            journeyName: 'UPW',
          },
          values: {},
        },
      }

      res.render.mockReset()
      res.send.mockReset()
      res.set.mockReset()
      req.sessionModel.get.mockReset()
      req.sessionModel.set.mockReset()
      req.form.options.fields = {}
      req.form.options.allFields = {}
      next.mockReset()
      nunjucks.render.mockReturnValue('RENDERED_TEMPLATE')
      pdfConverterClient.convertHtmlToPdf.mockReset()
      superMethod.mockReset()
      S3.prototype.upload.mockReset()
      SNS.prototype.publishJson.mockReset()
      hmppsAssessmentsApiClient.postCompleteAssessmentEpisode.mockReset()
    })

    it('completes the assessment', async () => {
      const file = createTestFile()

      pdfConverterClient.convertHtmlToPdf.mockResolvedValue({ ok: true, body: file })
      S3.prototype.upload.mockResolvedValue({ ok: true, key: `documents/${episodeUuid}}` })
      SNS.prototype.publishJson.mockResolvedValue({ ok: true })
      hmppsAssessmentsApiClient.postCompleteAssessmentEpisode.mockResolvedValue([
        true,
        { ended: '2023-01-01T00:00:00.000000' },
      ])

      await controller.render(req, res, next)

      expect(pdfConverterClient.convertHtmlToPdf).toHaveBeenCalledWith('RENDERED_TEMPLATE')
      expect(S3.prototype.upload).toHaveBeenCalledWith('documents/foo-document.pdf', file)
      expect(SNS.prototype.publishJson).toHaveBeenCalled()
      expect(hmppsAssessmentsApiClient.postCompleteAssessmentEpisode).toHaveBeenCalledWith(
        assessmentUuid,
        episodeUuid,
        user.token,
      )
      expect(req.session.assessment.isComplete).toBe(true)
      expect(superMethod).toHaveBeenCalled()
    })

    it('if already complete it does not re-complete the assessment', async () => {
      const file = createTestFile()

      pdfConverterClient.convertHtmlToPdf.mockResolvedValue({ ok: true, body: file })
      S3.prototype.upload.mockResolvedValue({ ok: true, key: `documents/${episodeUuid}}` })
      SNS.prototype.publishJson.mockResolvedValue({ ok: true })
      hmppsAssessmentsApiClient.postCompleteAssessmentEpisode.mockResolvedValue([true])

      req.session.assessment.isComplete = true

      await controller.render(req, res, next)

      expect(pdfConverterClient.convertHtmlToPdf.mock.calls.length).toBe(0)
      expect(S3.prototype.upload.mock.calls.length).toBe(0)
      expect(SNS.prototype.publishJson.mock.calls.length).toBe(0)
      expect(hmppsAssessmentsApiClient.postCompleteAssessmentEpisode.mock.calls.length).toBe(0)
      expect(superMethod).toHaveBeenCalled()
    })

    it('passes an error to the error handler when PDF conversion fails', async () => {
      pdfConverterClient.convertHtmlToPdf.mockResolvedValue({ ok: false })

      await controller.render(req, res, next)

      expect(next).toHaveBeenCalledWith(new Error('Failed to generate the PDF'))
      expect(superMethod).not.toHaveBeenCalled()
    })

    it('passes an error to the error handler when PDF upload fails', async () => {
      const file = createTestFile()

      pdfConverterClient.convertHtmlToPdf.mockResolvedValue({ ok: true, response: file })
      S3.prototype.upload.mockResolvedValue({ ok: false })

      await controller.render(req, res, next)

      expect(next).toHaveBeenCalledWith(new Error('Failed to upload the PDF'))
      expect(superMethod).not.toHaveBeenCalled()
    })

    it('passes an error to the error handler when unable to send the notification', async () => {
      const file = createTestFile()

      pdfConverterClient.convertHtmlToPdf.mockResolvedValue({ ok: true, body: file })
      S3.prototype.upload.mockResolvedValue({ ok: true, key: `documents/${episodeUuid}}` })
      SNS.prototype.publishJson.mockResolvedValue({ ok: false })

      await controller.render(req, res, next)

      expect(next).toHaveBeenCalledWith(new Error('Failed to publish "UPW Complete" event'))
      expect(superMethod).not.toHaveBeenCalled()
    })

    it('displays an error when unable to complete the assessment', async () => {
      const file = createTestFile()

      pdfConverterClient.convertHtmlToPdf.mockResolvedValue({ ok: true, body: file })
      S3.prototype.upload.mockResolvedValue({ ok: true, key: `documents/${episodeUuid}}` })
      SNS.prototype.publishJson.mockResolvedValue({ ok: true })
      hmppsAssessmentsApiClient.postCompleteAssessmentEpisode.mockResolvedValue([false])

      await controller.render(req, res, next)

      expect(next).toHaveBeenCalledWith(new Error('Failed to complete the assessment'))
      expect(superMethod).not.toHaveBeenCalled()
    })
  })
})
