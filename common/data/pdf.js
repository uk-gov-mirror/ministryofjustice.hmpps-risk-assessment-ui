const superagent = require('superagent')
const fs = require('fs')

const {
  headerHtml,
  footerHtml,
  pdfOptions: { marginTop, marginRight, marginBottom, marginLeft },
} = require('../../app/upw/templates/pdf-preview-and-declaration/components/print-pdf-header-footer')

const {
  apis: {
    pdfConverter: { url },
  },
} = require('../config')

const convertHtmlToPdf = async renderedHtml => {
  try {
    const request = superagent
      .post(url)
      .accept('application/json')
      .attach('files', Buffer.from(renderedHtml), 'index.html')
      .attach('files', fs.readFileSync('public/stylesheets/application.min.css'), 'application.min.css')
      .responseType('blob')

    if (headerHtml) request.attach('files', Buffer.from(headerHtml), 'header.html')
    if (footerHtml) request.attach('files', Buffer.from(footerHtml), 'footer.html')
    // Gotenberg defaults to A4 format. Page size and margins specified in inches

    if (marginTop) request.field('marginTop', marginTop)
    if (marginBottom) request.field('marginBottom', marginBottom)
    if (marginLeft) request.field('marginLeft', marginLeft)
    if (marginRight) request.field('marginRight', marginRight)

    // Gotenberg generated PDF
    const response = await request
    return { ok: response.ok, body: response.body, status: response.status }
  } catch (e) {
    const { response, status } = e
    return { ok: false, response, status }
  }
}

module.exports = {
  convertHtmlToPdf,
}
