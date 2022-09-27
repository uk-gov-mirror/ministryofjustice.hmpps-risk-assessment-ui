const upwSaveAndContinue = require('./saveAndContinue')

const checkGpDetails = function range(gpDetailsDeclined, gpDetails, gpDetailsComplete) {
  if (gpDetailsComplete !== 'YES') return true

  // User has either declined or there are GP details provided
  return gpDetailsDeclined === 'declined' || (Array.isArray(gpDetails) && gpDetails.length > 0)
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
  async validateFields(req, res, next) {
    // make changes to sessionModel fields to add in context specific validations
    // eslint-disable-next-line camelcase
    const { gp_details = [] } = req.sessionModel.get('persistedAnswers') || {}

    // eslint-disable-next-line camelcase
    const { gp_details_complete = '' } = req.form.values

    req.form.options.fields = customValidationsGpDetails(req.form.options.fields, gp_details, gp_details_complete)

    super.validateFields(req, res, next)
  }
}

module.exports = SaveAndContinue
