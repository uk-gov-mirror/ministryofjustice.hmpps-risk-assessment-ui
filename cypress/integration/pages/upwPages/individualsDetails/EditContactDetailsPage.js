const contactAddrBldngName = '#contact_address_building_name'
const contactAddrHouseNr = '#contact_address_house_number'
const contactAddrStreet = '#contact_address_street_name'
const contactAddrDistrict = '#contact_address_district'
const contactAddrTownCity = '#contact_address_town_or_city'
const contactAddrCounty = '#contact_address_county'
const contactAddrPostCode = '#contact_address_postcode'
const contactPhoneNumber = '#contact_phone_number'
const contactMobileNumber = '#contact_mobile_phone_number'
const contactEmailAddress = '#contact_email_addresses'
const contactAddrBldngNameSummError = '[href="#contact_address_building_name-error"]'
const contactAddrBldngNameFieldError = '[id="contact_address_building_name-error"]'
const contactAddrHouseNrSummError = '[href="#contact_address_house_number-error"]'
const contactAddrHouseNrFieldError = '[id="contact_address_house_number-error"]'
const contactAddrStreetSummError = '[href="#contact_address_street_name-error"]'
const contactAddrStreetFieldError = '[id="contact_address_street_name-error"]'
const contactAddrTownCitySummError = '[href="#contact_address_town_or_city-error"]'
const contactAddrTownCityFieldError = '[id="contact_address_town_or_city-error"]'
const contactAddrPostCodeSummError = '[href="#contact_address_postcode-error"]'
const contactAddrPostCodeFieldError = '[id="contact_address_postcode-error"]'
const contactPhoneNumberSummError = '[href="#contact_phone_number-error"]'
const contactPhoneNumberFieldError = '[id="contact_phone_number-error"]'
const contactMobileNumberSummError = '[href="#contact_mobile_phone_number-error"]'
const contactMobileNumberFieldError = '[id="contact_mobile_phone_number-error"]'
const contactEmailSummError = '[href="#contact_email_addresses-error"]'
const contactEmailFieldError = '[id="contact_email_addresses-error"]'
const contactDetailsSaveButton = '#main-content button'

module.exports = {
  enterContactAddrBldngName: (details) => {
    cy.get(contactAddrBldngName).as('contactAddrBuildingName').clear()
    cy.get('@contactAddrBuildingName').type(details)
  },

  enterContactAddrHouseNr: (details) => {
    cy.get(contactAddrHouseNr).as('contactAddressHouseNumber').clear()
    cy.get('@contactAddressHouseNumber').type(details)
  },

  enterContactAddrStreet: (details) => {
    cy.get(contactAddrStreet).as('contactAddressStreet').clear()
    cy.get('@contactAddressStreet').type(details)
  },

  enterContactAddrDistrict: (details) => {
    cy.get(contactAddrDistrict).as('contactAddressDistrict').clear()
    cy.get('@contactAddressDistrict').type(details)
  },

  enterContactAddrTownCity: (details) => {
    cy.get(contactAddrTownCity).as('contactAddressTownCity').clear()
    cy.get('@contactAddressTownCity').type(details)
  },

  enterContactAddrCounty: (details) => {
    cy.get(contactAddrCounty).as('contactAddressCounty').clear()
    cy.get('@contactAddressCounty').type(details)
  },

  enterContactAddrPostCode: (details) => {
    cy.get(contactAddrPostCode).as('contactAddressPostCode').clear()
    cy.get('@contactAddressPostCode').type(details)
  },

  enterContactPhoneNumber: (details) => {
    cy.get(contactPhoneNumber).as('contactPhoneNumber').clear()
    cy.get('@contactPhoneNumber').type(details)
  },

  enterContactMobileNumber: (details) => {
    cy.get(contactMobileNumber).as('contactMobileNumber').clear()
    cy.get('@contactMobileNumber').type(details)
  },

  enterContactEmailAddress: (details) => {
    cy.get(contactEmailAddress).as('contactEmailAddress').clear()
    cy.get('@contactEmailAddress').type(details)
  },

  clickSaveContactDetails: () => {
    cy.get(contactDetailsSaveButton).click()
  },
  contactAddrBldngName,
  contactAddrHouseNr,
  contactAddrStreet,
  contactAddrDistrict,
  contactAddrTownCity,
  contactAddrCounty,
  contactAddrPostCode,
  contactPhoneNumber,
  contactMobileNumber,
  contactEmailAddress,
  contactAddrBldngNameSummError,
  contactAddrBldngNameFieldError,
  contactAddrHouseNrSummError,
  contactAddrHouseNrFieldError,
  contactAddrStreetSummError,
  contactAddrStreetFieldError,
  contactAddrTownCitySummError,
  contactAddrTownCityFieldError,
  contactAddrPostCodeSummError,
  contactAddrPostCodeFieldError,
  contactPhoneNumberSummError,
  contactPhoneNumberFieldError,
  contactMobileNumberSummError,
  contactMobileNumberFieldError,
  contactEmailSummError,
  contactEmailFieldError,
  contactDetailsSaveButton,
}
