const { downloadUpwPdf } = require('./api')
const { S3 } = require('../../../common/data/aws')

jest.mock('../../../common/data/aws')

describe('UPW API', () => {
  describe('downloadUpwPdf', () => {
    let req

    const res = {
      set: jest.fn(),
      send: jest.fn(),
      status: jest.fn(),
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
    })

    it('returns the document from S3', async () => {
      req.params.episodeId = 'episodeId'

      S3.prototype.fetch.mockResolvedValue({ ok: true, body: 'FOO_FILE_DATA' })

      await downloadUpwPdf(req, res)

      expect(S3.prototype.fetch).toHaveBeenCalledWith(`documents/${req.params.episodeId}.pdf`)
      expect(res.send).toHaveBeenCalledWith('FOO_FILE_DATA')
    })

    it('returns 400 when not supplied a key', async () => {
      await downloadUpwPdf(req, res)

      expect(S3.prototype.fetch).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.send).toHaveBeenCalled()
    })

    it('returns a 404 when the key does not exist in S3', async () => {
      req.params.episodeId = 'episodeId'

      S3.prototype.fetch.mockResolvedValue({ ok: false, statusCode: 404 })

      await downloadUpwPdf(req, res)

      expect(S3.prototype.fetch).toHaveBeenCalledWith(`documents/${req.params.episodeId}.pdf`)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.send).toHaveBeenCalled()
    })
  })
})
