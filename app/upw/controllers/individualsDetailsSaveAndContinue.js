const upwSaveAndContinue = require('./saveAndContinue')

const checkContacts = function range(emergencyContactDeclined, emergencyContacts, individualDetailsComplete) {
  if (individualDetailsComplete !== 'YES') return true

  // validation fails if there are no emergency contacts and emergency_contact_declined field has not been selected
  return !((!emergencyContacts || !emergencyContacts.length) && emergencyContactDeclined === '')
}

const customValidationsIndividualsDetails = (fields, emergencyContacts, individualDetailsComplete) => {
  fields.emergency_contact_declined?.validate.push({
    fn: checkContacts,
    arguments: [emergencyContacts, individualDetailsComplete],
    message: 'You must provide an emergency contact or select if the individual has declined to give details.',
  })

  return fields
}
// need to overide validateFields function
class SaveAndContinue extends upwSaveAndContinue {
  async validateFields(req, res, next) {
    // make changes to sessionModel fields to add in context specific validations
    const { emergency_contacts = [] } = req.sessionModel.get('rawAnswers') || []

    const { individual_details_complete = '' } = req.form.values

    req.form.options.fields = customValidationsIndividualsDetails(
      req.form.options.fields,
      emergency_contacts,
      individual_details_complete,
    )

    super.validateFields(req, res, next)
  }
}

module.exports = SaveAndContinue
