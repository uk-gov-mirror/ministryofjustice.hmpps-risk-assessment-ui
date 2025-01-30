const upwSaveAndContinue = require('./saveAndContinue')
const { customValidationsEditEmergencyContact } = require('../fields')

class SaveAndContinue extends upwSaveAndContinue {
  async locals(req, res, next) {
    const contactToEdit = req.params.index
    res.locals.questionGroupCode = 'emergency_contact_details'
    if (contactToEdit !== 'new') {
      res.locals.pageTitle = `Emergency contact ${parseInt(contactToEdit, 10) + 1}`
      res.locals.questionGroupIndex = contactToEdit
    } else {
      res.locals.addingNewMultiple = true
      res.locals.pageTitle = 'Emergency contact'
    }
    await super.locals(req, res, next)
  }

  async validateFields(req, res, next) {
    // at this point makes changes to sessionModel fields to add in context specific validations
    // eslint-disable-next-line camelcase
    const { emergency_contact_phone_number = '', emergency_contact_mobile_phone_number = '' } = req.form.values

    req.form.options.fields = customValidationsEditEmergencyContact(
      req.form.options.fields,
      emergency_contact_phone_number,
      emergency_contact_mobile_phone_number,
    )

    super.validateFields(req, res, next)
  }

  async saveValues(req, res, next) {
    const contactToEdit = req.params.index
    if (contactToEdit !== 'new') {
      res.locals.questionGroupCode = 'emergency_contact_details'
      res.locals.multipleUpdated = contactToEdit
    } else {
      res.locals.addNewMultiple = 'emergency_contact_details'
    }

    await super.saveValues(req, res, next)
  }
}

module.exports = SaveAndContinue
