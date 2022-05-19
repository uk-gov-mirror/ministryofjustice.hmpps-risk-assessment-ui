const { convertGpDetailsEntries } = require('./gpDetails.utils')
const upwSaveAndContinue = require('./saveAndContinue')

const checkGpDetails = function range(gpDetailsDeclined, gpDetails, gpDetailsComplete) {
  if (gpDetailsComplete !== 'YES') return true

  // validation fails if there are no GP details and gp_details_declined field has not been selected
  return !((!gpDetails || !gpDetails.length) && gpDetailsDeclined === '')
}

const customValidationsGpDetails = (fields, gpDetails, gpDetailsComplete) => {
  fields.gp_details_declined?.validate.push({
    fn: checkGpDetails,
    arguments: [gpDetails, gpDetailsComplete],
    message: 'You must provide a GP contact or select if the individual has declined to give details.',
  })

  return fields
}

class SaveAndContinue extends upwSaveAndContinue {
  constructor(...args) {
    super(...args)
    // Migrate existing answers for "gp_first_name" and "gp_family_name" to the single "gp_name" field for display
    this.getAnswerModifiers = [convertGpDetailsEntries]
  }

  async validateFields(req, res, next) {
    // make changes to sessionModel fields to add in context specific validations
    const { gp_details = [] } = req.sessionModel.get('rawAnswers') || []

    const { gp_details_complete = '' } = req.form.values

    req.form.options.fields = customValidationsGpDetails(req.form.options.fields, gp_details, gp_details_complete)

    super.validateFields(req, res, next)
  }
}

module.exports = SaveAndContinue
