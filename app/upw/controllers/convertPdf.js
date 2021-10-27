/* eslint-disable class-methods-use-this */
const fs = require('fs')
const nunjucks = require('nunjucks')
const superagent = require('superagent')
const SaveAndContinue = require('./saveAndContinue')
const { apis } = require('../../../common/config')

class ConvertPdf extends SaveAndContinue {
  async render(req, res, next) {
    try {
      const rendered = nunjucks.render('app/upw/templates/pdf-preview-and-declaration/pdf.njk', {
        ...res.locals,
        css_path: 'application.min.css',
      })
      res.set('content-type', 'application/pdf')
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
