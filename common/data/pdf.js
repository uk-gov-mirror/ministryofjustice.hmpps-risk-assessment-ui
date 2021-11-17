const superagent = require('superagent')
const fs = require('fs')

const {
  apis: {
    pdfConverter: { url },
  },
} = require('../config')

const convertHtmlToPdf = async renderedHtml => {
  try {
    return await superagent
      .post(url)
      .accept('application/json')
      .attach('files', Buffer.from(renderedHtml), 'index.html')
      .attach('files', fs.readFileSync('public/stylesheets/application.min.css'), 'application.min.css')
      .responseType('blob')
      .then(({ ok, body, status }) => ({ ok, response: body, status }))
  } catch (e) {
    const { response, status } = e
    return { ok: false, response, status }
  }
}

module.exports = {
  convertHtmlToPdf,
}
