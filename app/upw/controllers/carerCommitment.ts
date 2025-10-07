import upwSaveAndContinue from './saveAndContinue'
import { customValidationsCaringCommitments } from '../fields'
import { CACHE } from '../../../common/utils/constants'

export default class SaveAndContinue extends upwSaveAndContinue {
  async validateFields(req, res, next) {
    // eslint-disable-next-line camelcase
    const { active_carer_commitments } = req.sessionModel.get(CACHE.PERSISTED_ANSWERS) || {}

    req.form.options.fields = customValidationsCaringCommitments(req.form.options.fields, active_carer_commitments)

    super.validateFields(req, res, next)
  }
}
