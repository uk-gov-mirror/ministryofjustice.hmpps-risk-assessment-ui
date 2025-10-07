import upwSaveAndContinue from './saveAndContinue'

export default class SaveAndContinue extends upwSaveAndContinue {
  async locals(req, res, next) {
    const contactToEdit = req.params.index
    res.locals.questionGroupCode = 'gp_details'
    res.locals.pageTitle = 'Details of GP'
    if (contactToEdit !== 'new') {
      res.locals.questionGroupIndex = contactToEdit
    } else {
      res.locals.addingNewMultiple = true
    }

    await super.locals(req, res, next)
  }

  async saveValues(req, res, next) {
    const contactToEdit = req.params.index
    if (contactToEdit !== 'new') {
      res.locals.questionGroupCode = 'gp_details'
      res.locals.multipleUpdated = contactToEdit
    } else {
      res.locals.addNewMultiple = 'gp_details'
    }

    await super.saveValues(req, res, next)
  }
}
