import deleteSaveAndContinue from './removeMultipleGroupItem'

export default class SaveAndContinue extends deleteSaveAndContinue {
  async locals(req, res, next) {
    res.locals.multipleGroupName = 'gp_details'

    await super.locals(req, res, next)
  }
}
