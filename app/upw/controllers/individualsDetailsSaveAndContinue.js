const upwSaveAndContinue = require('./saveAndContinue')

const checkContacts = function range(emergencyContactDeclined, emergencyContacts, individualDetailsComplete) {
  if (individualDetailsComplete !== 'YES') return true

  // User has either declined or there are Emergency Contacts details provided
  return emergencyContactDeclined === 'declined' || (Array.isArray(emergencyContacts) && emergencyContacts.length > 0)
}

const customValidationsIndividualsDetails = (fields, emergencyContacts, individualDetailsComplete) => {
  fields.emergency_contact_declined?.validate.push({
    fn: checkContacts,
    arguments: [emergencyContacts, individualDetailsComplete],
    message: 'You must provide an emergency contact or select if the individual has declined to give details.',
  })

  return fields
}

class SaveAndContinue extends upwSaveAndContinue {
  async validateFields(req, res, next) {
    // make changes to sessionModel fields to add in context specific validations
    // eslint-disable-next-line camelcase
    const { emergency_contact_details = [] } = req.sessionModel.get('persistedAnswers') || {}

    // eslint-disable-next-line camelcase
    const { individual_details_complete = '' } = req.form.values

    req.form.options.fields = customValidationsIndividualsDetails(
      req.form.options.fields,
      emergency_contact_details,
      individual_details_complete,
    )

    super.validateFields(req, res, next)
  }
}

module.exports = SaveAndContinue
