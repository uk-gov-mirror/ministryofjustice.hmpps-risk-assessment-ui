const emergencyContactFirstName = '#emergency_contact_first_name'
const emergencyContactFamilyName = '#emergency_contact_family_name'
const emergencyContactRelationship = '#emergency_contact_relationship'
const emergencyContactPhone = '#emergency_contact_phone_number'
const emergencyContactMobile = '#emergency_contact_mobile_phone_number'
const emrgncyContactFirstNameSummError = '[href="#emergency_contact_first_name-error"]'
const emrgncyContactFirstNameFieldError = '[id="emergency_contact_first_name-error"]'
const emrgncyContactFamilyNameSummError = '[href="#emergency_contact_family_name-error"]'
const emrgncyContactFamilyNameFieldError = '[id="emergency_contact_family_name-error"]'
const emrgncyContactRelationshipSummError = '[href="#emergency_contact_relationship-error"]'
const emrgncyContactRelationshipFieldError = '[id="emergency_contact_relationship-error"]'
const emrgncyContactPhoneSummError = '[href="#emergency_contact_phone_number-error"]'
const emrgncyContactPhoneFieldError = '[id="emergency_contact_phone_number-error"]'
const emrgncyContactMobileSummError = '[href="#emergency_contact_mobile_phone_number-error"]'
const emrgncyContactMobileFieldError = '[id="emergency_contact_mobile_phone_number-error"]'

module.exports = {
  enterEmergencyContactFirstName: (details) => {
    cy.get(emergencyContactFirstName).as('emergencyContactFirstName').clear()
    cy.get('@emergencyContactFirstName').type(details)
  },

  enterEmergencyContactFamilyName: (details) => {
    cy.get(emergencyContactFamilyName).as('emergencyContactFamilyName').clear()
    cy.get('@emergencyContactFamilyName').type(details)
  },

  enterEmergencyContactRelationship: (details) => {
    cy.get(emergencyContactRelationship).as('emergencyContactRelationship').clear()
    cy.get('@emergencyContactRelationship').type(details)
  },

  enterEmergencyContactPhone: (details) => {
    cy.get(emergencyContactPhone).as('emergencyContactPhone').clear()
    cy.get('@emergencyContactPhone').type(details)
  },

  enterEmergencyContactMobile: (details) => {
    cy.get(emergencyContactMobile).as('emergencyContactMobile').clear()
    cy.get('@emergencyContactMobile').type(details)
  },
  emergencyContactFirstName,
  emergencyContactFamilyName,
  emergencyContactRelationship,
  emergencyContactPhone,
  emergencyContactMobile,
  emrgncyContactFirstNameSummError,
  emrgncyContactFirstNameFieldError,
  emrgncyContactFamilyNameSummError,
  emrgncyContactFamilyNameFieldError,
  emrgncyContactRelationshipSummError,
  emrgncyContactRelationshipFieldError,
  emrgncyContactPhoneSummError,
  emrgncyContactPhoneFieldError,
  emrgncyContactMobileSummError,
  emrgncyContactMobileFieldError,
}
