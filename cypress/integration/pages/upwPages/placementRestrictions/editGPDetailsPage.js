const gpNameTextBox = '#gp_name '
const medicalPracticeTextBox = '#gp_practice_name'
const gpAddrBldngNameTextBox = '#gp_address_building_name'
const gpAddrHouseNrTextBox = '#gp_address_house_number'
const gpAddrStreetTextBox = '#gp_address_street_name'
const gpAddrDistrictTextBox = '#gp_address_district'
const gpAddrTownCityTextBox = '#gp_address_town_or_city'
const gpAddrCountyTextBox = '#gp_address_county'
const gpAddrPostCodeTextBox = '#gp_address_postcode'
const gpPhoneNumberTextBox = '#gp_phone_number'
const gpPracticeNameSummError = '[href="#gp_practice_name-error"]'
const gpPracticeNameFieldError = '[id="gp_practice_name-error"]'
const gpPhoneNumberSummError = '[href="#gp_phone_number-error"]'
const gpPhoneNumberFieldError = '[id="gp_phone_number-error"]'
const gpDetailsSaveButton = '.govuk-\\!-margin-bottom-3'

module.exports = {
  entergpName: (details) => {
    cy.get(gpNameTextBox).as('gpNameTextBox').clear()
    cy.get('@gpNameTextBox').type(details)
  },

  enterMedicalPracticeName: (details) => {
    cy.get(medicalPracticeTextBox).as('medicalPracticeTextBox').clear()
    cy.get('@medicalPracticeTextBox').type(details)
  },

  enterGPAddrBldngName: (details) => {
    cy.get(gpAddrBldngNameTextBox).as('gpAddrBuildingNameTextBox').clear()
    cy.get('@gpAddrBuildingNameTextBox').type(details)
  },

  enterGPAddrHouseNr: (details) => {
    cy.get(gpAddrHouseNrTextBox).as('gpAddressHouseNumberTextBox').clear()
    cy.get('@gpAddressHouseNumberTextBox').type(details)
  },

  enterGPAddrStreet: (details) => {
    cy.get(gpAddrStreetTextBox).as('gpAddressStreetTextBox').clear()
    cy.get('@gpAddressStreetTextBox').type(details)
  },

  enterGPAddrDistrict: (details) => {
    cy.get(gpAddrDistrictTextBox).as('gpAddressDistrictTextBox').clear()
    cy.get('@gpAddressDistrictTextBox').type(details)
  },

  enterGPAddrTownCity: (details) => {
    cy.get(gpAddrTownCityTextBox).as('gpAddressTownCityTextBox').clear()
    cy.get('@gpAddressTownCityTextBox').type(details)
  },

  enterGPAddrCounty: (details) => {
    cy.get(gpAddrCountyTextBox).as('gpAddressCountyTextBox').clear()
    cy.get('@gpAddressCountyTextBox').type(details)
  },

  enterGPAddrPostCode: (details) => {
    cy.get(gpAddrPostCodeTextBox).as('gpAddressPostCodeTextBox').clear()
    cy.get('@gpAddressPostCodeTextBox').type(details)
  },

  enterGPPhoneNumber: (details) => {
    cy.get(gpPhoneNumberTextBox).as('gpPhoneNumberTextBox').clear()
    cy.get('@gpPhoneNumberTextBox').type(details)
  },

  clickSaveGPDetails: () => {
    cy.get(gpDetailsSaveButton).click()
  },
  gpNameTextBox,
  medicalPracticeTextBox,
  gpAddrBldngNameTextBox,
  gpAddrHouseNrTextBox,
  gpAddrStreetTextBox,
  gpAddrDistrictTextBox,
  gpAddrTownCityTextBox,
  gpAddrCountyTextBox,
  gpAddrPostCodeTextBox,
  gpPhoneNumberTextBox,
  gpPracticeNameSummError,
  gpPracticeNameFieldError,
  gpPhoneNumberSummError,
  gpPhoneNumberFieldError,
  gpDetailsSaveButton,
}
