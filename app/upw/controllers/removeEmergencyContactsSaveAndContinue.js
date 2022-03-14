const deleteSaveAndContinue = require('./removeMultipleGroupItem')

class SaveAndContinue extends deleteSaveAndContinue {
  async locals(req, res, next) {
    res.locals.multipleGroupName = 'emergency_contacts'

    await super.locals(req, res, next)
  }
}

module.exports = SaveAndContinue
