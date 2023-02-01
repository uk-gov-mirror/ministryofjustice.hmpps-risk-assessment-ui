const { S3 } = require('../../../common/data/aws')
const { createDocumentId } = require('../../../common/utils/util')

const downloadUpwPdf = async (req, res) => {
  const { episodeId } = req.params

  if (!episodeId) {
    return res.status(400).send()
  }

  const s3 = new S3()
  const response = await s3.fetch(createDocumentId(episodeId))

  if (response.ok) {
    return res
      .status(200)
      .set('Content-Type', 'application/pdf')
      .set('Content-Length', response.body.length)
      .send(response.body)
  }
  return res.status(response.statusCode).send()
}

module.exports = {
  downloadUpwPdf,
}
