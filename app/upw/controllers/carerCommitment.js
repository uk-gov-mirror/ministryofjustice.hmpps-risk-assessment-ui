const upwSaveAndContinue = require('./saveAndContinue').default
const { customValidationsCaringCommitments } = require('../fields').default
const { CACHE } = require('../../../common/utils/constants').default

class SaveAndContinue extends upwSaveAndContinue {
  async validateFields(req, res, next) {
    // eslint-disable-next-line camelcase
    const { active_carer_commitments } = req.sessionModel.get(CACHE.PERSISTED_ANSWERS) || {}

    req.form.options.fields = customValidationsCaringCommitments(req.form.options.fields, active_carer_commitments)

    super.validateFields(req, res, next)
  }
}

module.exports = SaveAndContinue
