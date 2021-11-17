/* eslint-disable class-methods-use-this */
const nunjucks = require('nunjucks')
const SaveAndContinue = require('./saveAndContinue')
const logger = require('../../../common/logging/logger')
const { uploadPdfDocumentToDelius } = require('../../../common/data/hmppsAssessmentApi')
const { convertHtmlToPdf } = require('../../../common/data/pdf')

const createFileNameFrom = (type, ...parts) => {
  const fileName = parts
    .filter(s => s !== '')
    .join('-')
    .toLowerCase()
  return `${fileName}.${type}`
}

class Confirmation extends SaveAndContinue {
  async render(req, res, next) {
    try {
      const renderedHtml = nunjucks.render('app/upw/templates/pdf-preview-and-declaration/pdf.njk', {
        ...res.locals,
        css_path: 'application.min.css',
      })

      const firstName = res.locals.rawAnswers.first_name || ''
      const familyName = res.locals.rawAnswers.family_name || ''
      const crn = res.locals.rawAnswers.crn || ''

      const fileName = createFileNameFrom('pdf', firstName, familyName, crn)

      const pdfConvertResponse = await convertHtmlToPdf(renderedHtml)

      if (!pdfConvertResponse.ok) {
        logger.error(`Failed to convert template to PDF, status=${pdfConvertResponse.status}`)
        throw new Error('Failed to convert template to PDF')
      }

      const deliusUploadResponse = await uploadPdfDocumentToDelius(
        req.session?.assessment?.uuid,
        req.session?.assessment?.episodeUuid,
        { document: pdfConvertResponse.body, fileName },
        req.user,
      )

      if (!deliusUploadResponse.ok) {
        if (deliusUploadResponse.status >= 500) {
          return res.redirect('/UPW/delius-error')
        }

        logger.error(`Failed to upload the PDF, status=${deliusUploadResponse.status}`)
        throw new Error('Failed to upload the PDF')
      }

      return super.render(req, res, next)
    } catch (e) {
      return next(e)
    }
  }
}

module.exports = Confirmation
