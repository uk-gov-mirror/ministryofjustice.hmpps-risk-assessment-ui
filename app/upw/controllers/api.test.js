const nunjucks = require('nunjucks')
const { downloadUpwPdf } = require('./api')
const { S3 } = require('../../../common/data/aws/s3')
const assessmentsApi = require('../../../common/data/hmppsAssessmentApi')
const { convertHtmlToPdf } = require('../../../common/data/pdf')
const { getRegistrations, getRoshRiskSummary } = require('./common.utils')
const { getApiToken } = require('../../../common/data/oauth')

jest.mock('../../../common/data/aws/s3')
jest.mock('../../../common/data/hmppsAssessmentApi')
jest.mock('../../../common/data/pdf')
jest.mock('./common.utils')
jest.mock('nunjucks')
jest.mock('../../../common/data/oauth')

describe('UPW API', () => {
  describe('downloadUpwPdf', () => {
    let req

    const res = {
      set: jest.fn(),
      send: jest.fn(),
      status: jest.fn(),
    }

    const next = jest.fn()

    const mockS3ResponseBody = {
      pipe: jest.fn(),
    }

    beforeEach(() => {
      req = {
        params: {},
      }

      res.send.mockReset()
      res.set.mockReset()
      res.status.mockReset()
      res.set.mockReturnValue(res)
      res.status.mockReturnValue(res)
      S3.prototype.fetch.mockReset()
      convertHtmlToPdf.mockReset()
      assessmentsApi.getEpisode.mockReset()
      assessmentsApi.getOffenderData.mockReset()
      getRegistrations.mockReset()
      getRoshRiskSummary.mockReset()
      nunjucks.render.mockReset()
      getApiToken.mockReset()
      next.mockReset()
      mockS3ResponseBody.pipe.mockReset()
    })

    it('returns the document from S3', async () => {
      req.params.episodeId = 'episodeId'

      S3.prototype.fetch.mockResolvedValue({ ok: true, body: mockS3ResponseBody })

      await downloadUpwPdf(req, res, next)

      expect(S3.prototype.fetch).toHaveBeenCalledWith(`documents/${req.params.episodeId}.pdf`)
      expect(mockS3ResponseBody.pipe).toHaveBeenCalledWith(res)
    })

    it('returns 400 when not supplied a key', async () => {
      await downloadUpwPdf(req, res, next)

      expect(S3.prototype.fetch).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalled()
    })

    it('regenerates the document when the document does not exist in S3', async () => {
      req.params.episodeId = 'episodeId'

      S3.prototype.fetch.mockResolvedValue({ ok: false, error: { name: 'NotFound', statusCode: 404 } })
      getApiToken.mockResolvedValue('FOO_TOKEN')
      assessmentsApi.getEpisode.mockResolvedValue({
        assessmentUuid: 'FOO_ID',
        userFullName: 'Some User',
        offence: {},
        answers: {},
      })
      assessmentsApi.getOffenderData.mockResolvedValue({ crn: '1234567' })
      getRegistrations.mockResolvedValue({})
      getRoshRiskSummary.mockResolvedValue({ roshRiskSummary: {} })
      nunjucks.render.mockReturnValue('FOO_HTML')
      convertHtmlToPdf.mockResolvedValue({ ok: true, body: 'FOO_PDF' })

      await downloadUpwPdf(req, res)

      expect(S3.prototype.fetch).toHaveBeenCalledWith(`documents/${req.params.episodeId}.pdf`)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.send).toHaveBeenCalledWith('FOO_PDF')
    })

    it('returns a 500 when it fails to generate the PDF document', async () => {
      req.params.episodeId = 'episodeId'

      S3.prototype.fetch.mockResolvedValue({ ok: false, error: { name: 'NotFound', statusCode: 404 } })
      getApiToken.mockResolvedValue('FOO_TOKEN')
      assessmentsApi.getEpisode.mockResolvedValue({
        assessmentUuid: 'FOO_ID',
        userFullName: 'Some User',
        offence: {},
        answers: {},
      })
      assessmentsApi.getOffenderData.mockResolvedValue({ crn: '1234567' })
      getRegistrations.mockResolvedValue({})
      getRoshRiskSummary.mockResolvedValue({ roshRiskSummary: {} })
      nunjucks.render.mockReturnValue('FOO_HTML')
      convertHtmlToPdf.mockResolvedValue({ ok: false })

      await downloadUpwPdf(req, res)

      expect(S3.prototype.fetch).toHaveBeenCalledWith(`documents/${req.params.episodeId}.pdf`)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.send).toHaveBeenCalled()
    })
  })
})
