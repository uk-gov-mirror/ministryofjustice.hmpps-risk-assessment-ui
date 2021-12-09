const { Controller } = require('hmpo-form-wizard')
const nunjucks = require('nunjucks')

const ConfirmationController = require('./confirmation')
const pdfConverterClient = require('../../../common/data/pdf')
const hmppsAssessmentsApiClient = require('../../../common/data/hmppsAssessmentApi')

jest.mock('nunjucks')
jest.mock('../../../common/data/pdf')
jest.mock('../../../common/data/hmppsAssessmentApi')
jest.mock('../../../common/utils/util', () => ({
  getCorrelationId: jest.fn(() => 'mocked-correlation-id'),
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
        rawAnswers: {
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
            subject: { dob: '1980-01-01' },
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
      hmppsAssessmentsApiClient.uploadPdfDocumentToDelius.mockReset()
      superMethod.mockReset()
      req.session.save.mockReset()
    })

    it('calls the PDF convert and passes the response to the backend API', async () => {
      const file = createTestFile()

      pdfConverterClient.convertHtmlToPdf.mockResolvedValue({ ok: true, response: file })
      hmppsAssessmentsApiClient.uploadPdfDocumentToDelius.mockResolvedValue({ ok: true })
      hmppsAssessmentsApiClient.postCompleteAssessment.mockResolvedValue([true])

      await controller.render(req, res, next)

      expect(pdfConverterClient.convertHtmlToPdf).toHaveBeenCalledWith('RENDERED_TEMPLATE')
      expect(hmppsAssessmentsApiClient.uploadPdfDocumentToDelius).toHaveBeenCalledWith(
        assessmentUuid,
        episodeUuid,
        { fileName: 'robert-x123456.pdf', document: file },
        user,
      )
      expect(superMethod).toHaveBeenCalled()
    })

    it('passes an error to the error handler when PDF conversion fails', async () => {
      pdfConverterClient.convertHtmlToPdf.mockResolvedValue({ ok: false })

      await controller.render(req, res, next)

      expect(pdfConverterClient.convertHtmlToPdf).toHaveBeenCalledWith('RENDERED_TEMPLATE')
      expect(next).toHaveBeenCalledWith(new Error('Failed to convert template to PDF'))
    })

    it('redirects to the "Delius is down" page when uploading the PDF returns a 400', async () => {
      const file = createTestFile()

      pdfConverterClient.convertHtmlToPdf.mockResolvedValue({ ok: true, response: file })
      hmppsAssessmentsApiClient.uploadPdfDocumentToDelius.mockResolvedValue({ ok: false, status: 400 })

      await controller.render(req, res, next)

      expect(pdfConverterClient.convertHtmlToPdf).toHaveBeenCalledWith('RENDERED_TEMPLATE')
      expect(hmppsAssessmentsApiClient.uploadPdfDocumentToDelius).toHaveBeenCalledWith(
        assessmentUuid,
        episodeUuid,
        { fileName: 'robert-x123456.pdf', document: file },
        user,
      )
      expect(res.redirect).toHaveBeenCalledWith('/UPW/delius-error')
    })

    it('redirects to the "Delius is down" page when uploading the PDF returns a 502', async () => {
      const file = createTestFile()

      pdfConverterClient.convertHtmlToPdf.mockResolvedValue({ ok: true, response: file })
      hmppsAssessmentsApiClient.uploadPdfDocumentToDelius.mockResolvedValue({ ok: false, status: 502 })

      await controller.render(req, res, next)

      expect(pdfConverterClient.convertHtmlToPdf).toHaveBeenCalledWith('RENDERED_TEMPLATE')
      expect(hmppsAssessmentsApiClient.uploadPdfDocumentToDelius).toHaveBeenCalledWith(
        assessmentUuid,
        episodeUuid,
        { fileName: 'robert-x123456.pdf', document: file },
        user,
      )
      expect(res.redirect).toHaveBeenCalledWith('/UPW/delius-error')
    })

    it('redirects to the "Delius is down" page when uploading the PDF returns a 503', async () => {
      const file = createTestFile()

      pdfConverterClient.convertHtmlToPdf.mockResolvedValue({ ok: true, response: file })
      hmppsAssessmentsApiClient.uploadPdfDocumentToDelius.mockResolvedValue({ ok: false, status: 503 })

      await controller.render(req, res, next)

      expect(pdfConverterClient.convertHtmlToPdf).toHaveBeenCalledWith('RENDERED_TEMPLATE')
      expect(hmppsAssessmentsApiClient.uploadPdfDocumentToDelius).toHaveBeenCalledWith(
        assessmentUuid,
        episodeUuid,
        { fileName: 'robert-x123456.pdf', document: file },
        user,
      )
      expect(res.redirect).toHaveBeenCalledWith('/UPW/delius-error')
    })

    it('completes the assessment', async () => {
      const file = createTestFile()

      pdfConverterClient.convertHtmlToPdf.mockResolvedValue({ ok: true, response: file })
      hmppsAssessmentsApiClient.uploadPdfDocumentToDelius.mockResolvedValue({ ok: true })
      hmppsAssessmentsApiClient.postCompleteAssessment.mockResolvedValue([true])

      await controller.render(req, res, next)

      expect(hmppsAssessmentsApiClient.postCompleteAssessment).toHaveBeenCalledWith(assessmentUuid, user.token, user.id)
      expect(superMethod).toHaveBeenCalled()
    })

    it('displays an error when unable to complete the assessment', async () => {
      const file = createTestFile()

      pdfConverterClient.convertHtmlToPdf.mockResolvedValue({ ok: true, response: file })
      hmppsAssessmentsApiClient.uploadPdfDocumentToDelius.mockResolvedValue({ ok: true })
      hmppsAssessmentsApiClient.postCompleteAssessment.mockResolvedValue([false])

      await controller.render(req, res, next)

      expect(hmppsAssessmentsApiClient.postCompleteAssessment).toHaveBeenCalledWith(assessmentUuid, user.token, user.id)
      expect(next).toHaveBeenCalledWith(new Error('Failed to complete the assessment'))
      expect(superMethod).not.toHaveBeenCalled()
    })
  })
})
