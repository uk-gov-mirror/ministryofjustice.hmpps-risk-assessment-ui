/* eslint-disable class-methods-use-this */
const fs = require('fs')
const nunjucks = require('nunjucks')
const superagent = require('superagent')
const SaveAndContinue = require('./saveAndContinue')
const { apis } = require('../../../common/config')
const { trackEvent } = require('../../../common/logging/app-insights')
const { EVENTS } = require('../../../common/utils/constants')

class ConvertPdf extends SaveAndContinue {
  async render(req, res, next) {
    try {
      trackEvent(EVENTS.ARN_PDF_DOWNLOAD, req)

      const rendered = nunjucks.render('app/upw/templates/pdf-preview-and-declaration/pdf.njk', {
        ...res.locals,
        css_path: 'application.min.css',
      })

      const firstName = res.locals.rawAnswers.first_name || ''
      const familyName = res.locals.rawAnswers.family_name || ''
      const crn = res.locals.rawAnswers.crn || ''

      const fileName = [firstName, familyName, crn]
        .filter(s => s !== '')
        .join('-')
        .toLowerCase()

      res.set('Content-Type', 'application/pdf')
      res.set('Content-Disposition', `attachment; filename="upw-${fileName}.pdf"`)

      return superagent
        .post(apis?.pdfConverter?.url)
        .accept('application/json')
        .attach('files', Buffer.from(rendered), 'index.html')
        .attach('files', fs.readFileSync('public/stylesheets/application.min.css'), 'application.min.css')
        .pipe(res)
    } catch (e) {
      return res.send(e.message)
    }
  }
}

module.exports = ConvertPdf
