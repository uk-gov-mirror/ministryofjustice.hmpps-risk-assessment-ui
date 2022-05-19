const SaveAndContinue = require('./saveAndContinue')
const { convertGpDetailsEntries } = require('./gpDetails.utils')

class PreviewPdf extends SaveAndContinue {
  constructor(...args) {
    super(...args)
    // Migrate existing answers for "gp_first_name" and "gp_family_name" to the single "gp_name" field for display
    this.getAnswerModifiers = [convertGpDetailsEntries]
  }
}

module.exports = PreviewPdf
