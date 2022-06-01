const upwSaveAndContinue = require('./saveAndContinue')

class SaveAndContinue extends upwSaveAndContinue {
  async locals(req, res, next) {
    const contactToEdit = req.params[0]
    res.locals.questionGroupCode = 'gp_details'
    if (contactToEdit !== 'new') {
      res.locals.pageTitle = 'Edit GP details'
      res.locals.multipleToEdit = contactToEdit
    } else {
      res.locals.addingNewMultiple = true
      res.locals.pageTitle = 'Add GP details'
    }

    await super.locals(req, res, next)
  }

  async saveValues(req, res, next) {
    const contactToEdit = req.params[0]
    if (contactToEdit !== 'new') {
      res.locals.questionGroupCode = 'gp_details'
      res.locals.multipleUpdated = contactToEdit
    } else {
      res.locals.addNewMultiple = 'gp_details'
    }

    await super.saveValues(req, res, next)
  }
}

module.exports = SaveAndContinue
