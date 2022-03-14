const deleteSaveAndContinue = require('./removeMultipleGroupItem')

class SaveAndContinue extends deleteSaveAndContinue {
  async locals(req, res, next) {
    res.locals.multipleGroupName = 'gp_details'

    await super.locals(req, res, next)
  }
}

module.exports = SaveAndContinue
