/* eslint-disable camelcase */
import upwSaveAndContinue from './saveAndContinue'
import { customValidationsEditContactDetails } from '../fields'

export default class SaveAndContinue extends upwSaveAndContinue {
  async validateFields(req, res, next) {
    // getting the value of the fields we are interested in
    const {
      contact_phone_number = '',
      contact_mobile_phone_number = '',
      contact_address_building_name = '',
      contact_address_house_number = '',
    } = req.form.values

    req.form.options.fields = customValidationsEditContactDetails(
      req.form.options.fields,
      contact_phone_number,
      contact_mobile_phone_number,
      contact_address_building_name,
      contact_address_house_number,
    )

    super.validateFields(req, res, next)
  }
}
