const upwSaveAndContinue = require('./saveAndContinue')
const { customValidationsCaringCommitments } = require('../fields')
const { CACHE } = require('../../../common/utils/constants')

class SaveAndContinue extends upwSaveAndContinue {
  async validateFields(req, res, next) {
    // eslint-disable-next-line camelcase
    const { active_carer_commitments } = req.sessionModel.get(CACHE.PERSISTED_ANSWERS) || {}

    req.form.options.fields = customValidationsCaringCommitments(req.form.options.fields, active_carer_commitments)

    super.validateFields(req, res, next)
  }
}

module.exports = SaveAndContinue
