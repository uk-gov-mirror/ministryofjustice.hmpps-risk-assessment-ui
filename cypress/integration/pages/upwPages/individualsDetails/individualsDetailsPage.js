const changeOrAddContactDetails = '[href="edit-contact-details"]'
const addEmergencyContactDetails = '.govuk-button--secondary'
const contactDetailsAddress = '#main-content dl:nth-child(4) > div:nth-child(1)'
const contactDetailsMobileNr = '#main-content dl:nth-child(4) > div:nth-child(2)'
const contactDetailsPhoneNr = '#main-content dl:nth-child(4) > div:nth-child(3)'
const contactDetailsEmail = '#main-content dl:nth-child(4) > div:nth-child(4)'
const emergencyContactDetailsName = '#main-content dl:nth-child(7) div:nth-child(1) dd'
const emergencyContactDetailsSurname = ':nth-child(7) > :nth-child(2) > .govuk-summary-list__value'
const emergencyContactDetailsRelationship = ':nth-child(7) > :nth-child(3) > .govuk-summary-list__value'
const emergencyContactDetailsMobile = ':nth-child(7) > :nth-child(4) > .govuk-summary-list__value'
const emergencyContactDetailsPhoneNr = ':nth-child(7) > :nth-child(5) > .govuk-summary-list__value'
const emergencyContactDetailsTwoName = ':nth-child(9) > :nth-child(1) > .govuk-summary-list__value'
const emergencyContactDetailsTwoSurname = ':nth-child(9) > :nth-child(2) > .govuk-summary-list__value'
const emergencyContactDetailsTwoRelationship = ':nth-child(9) > :nth-child(3) > .govuk-summary-list__value'
const emergencyContactDetailsTwoMobile = ':nth-child(9) > :nth-child(4) > .govuk-summary-list__value'
const emergencyContactDetailsTwoPhoneNr = ':nth-child(9) > :nth-child(5) > .govuk-summary-list__value'
const emergencyContactDetailsThreeName = ':nth-child(11) > :nth-child(1) > .govuk-summary-list__value'
const emergencyContactDetailsThreeSurname = ':nth-child(11) > :nth-child(2) > .govuk-summary-list__value'
const emergencyContactDetailsThreeRelationship = ':nth-child(11) > :nth-child(3) > .govuk-summary-list__value'
const emergencyContactDetailsThreeMobile = ':nth-child(11) > :nth-child(4) > .govuk-summary-list__value'
const emergencyContactDetailsThreePhoneNr = ':nth-child(11) > :nth-child(5) > .govuk-summary-list__value'
const emergencyContactDetailsFourName = ':nth-child(13) > :nth-child(1) > .govuk-summary-list__value'
const emergencyContactDetailsFourSurname = ':nth-child(13) > :nth-child(2) > .govuk-summary-list__value'
const emergencyContactDetailsFourRelationship = ':nth-child(13) > :nth-child(3) > .govuk-summary-list__value'
const emergencyContactDetailsFourMobile = ':nth-child(13) > :nth-child(4) > .govuk-summary-list__value'
const emergencyContactDetailsFourPhoneNr = ':nth-child(13) > :nth-child(5) > .govuk-summary-list__value'
const emergencyContactOneRemoveLink = '[href="remove-emergency-contact/0"]'
const emergencyContactTwoRemoveLink = '[href="remove-emergency-contact/1"]'
const emergencyContactThreeRemoveLink = '[href="remove-emergency-contact/2"]'
const emergencyContactFourRemoveLink = '[href="remove-emergency-contact/3"]'
const emergencyContactOneChangeLink = '[href="edit-emergency-contact/0"]'
const emergencyContactTwoChangeLink = '[href="edit-emergency-contact/1"]'
const emergencyContactThreeChangeLink = '[href="edit-emergency-contact/2"]'
const emergencyContactFourChangeLink = '[href="edit-emergency-contact/3"]'
const emergencyContactDeclineCheckBox = '#emergency_contact_declined'
const emrgncyContactDeclndSummError = '[href="#emergency_contact_declined-error"]'
const emrgncyContactDeclndFieldError = '[id="emergency_contact_declined-error"]'
const markSectionCompleteRButtonYes = '#individual_details_complete'
const iWillComeBackLaterRBtn = '#individual_details_complete-2'
const saveButton = '.govuk-button'

module.exports = {
  clickChangeContactDetails: () => {
    cy.get(changeOrAddContactDetails).click()
  },

  clickChangeEmergncyContact: (contactNr) => {
    if (contactNr === 'Emergency Contact 1') {
      cy.get(emergencyContactOneChangeLink).click()
    } else if (contactNr === 'Emergency Contact 2') {
      cy.get(emergencyContactTwoChangeLink).click()
    } else if (contactNr === 'Emergency Contact 3') {
      cy.get(emergencyContactThreeChangeLink).click()
    } else if (contactNr === 'Emergency Contact 4') {
      cy.get(emergencyContactFourChangeLink).click()
    }
  },

  clickRemoveEmergncyContact: (contactNr) => {
    if (contactNr === 'Emergency Contact 1') {
      cy.get(emergencyContactOneRemoveLink).click()
    } else if (contactNr === 'Emergency Contact 2') {
      cy.get(emergencyContactTwoRemoveLink).click()
    } else if (contactNr === 'Emergency Contact 3') {
      cy.get(emergencyContactThreeRemoveLink).click()
    } else if (contactNr === 'Emergency Contact 4') {
      cy.get(emergencyContactFourRemoveLink).click()
    }
  },

  clickAddEmergncyContactDetails: () => {
    cy.get(addEmergencyContactDetails).click()
  },

  clickEmergncyContactDecline: () => {
    cy.get(emergencyContactDeclineCheckBox).check()
  },

  selectIndvdlDetailsSectionComplete: (option) => {
    if (option === 'Yes') {
      cy.get(markSectionCompleteRButtonYes).check()
    } else {
      cy.get(iWillComeBackLaterRBtn).check()
    }
  },

  clickSaveButton: () => cy.get('.govuk-button').click(),
  changeOrAddContactDetails,
  addEmergencyContactDetails,
  contactDetailsAddress,
  contactDetailsMobileNr,
  contactDetailsPhoneNr,
  contactDetailsEmail,
  emergencyContactDetailsName,
  emergencyContactDetailsSurname,
  emergencyContactDetailsRelationship,
  emergencyContactDetailsMobile,
  emergencyContactDetailsPhoneNr,
  emergencyContactDetailsTwoName,
  emergencyContactDetailsTwoSurname,
  emergencyContactDetailsTwoRelationship,
  emergencyContactDetailsTwoMobile,
  emergencyContactDetailsTwoPhoneNr,
  emergencyContactDetailsThreeName,
  emergencyContactDetailsThreeSurname,
  emergencyContactDetailsThreeRelationship,
  emergencyContactDetailsThreeMobile,
  emergencyContactDetailsThreePhoneNr,
  emergencyContactDetailsFourName,
  emergencyContactDetailsFourSurname,
  emergencyContactDetailsFourRelationship,
  emergencyContactDetailsFourMobile,
  emergencyContactDetailsFourPhoneNr,
  emrgncyContactDeclndSummError,
  emrgncyContactDeclndFieldError,
  emergencyContactDeclineCheckBox,
  emergencyContactOneRemoveLink,
  emergencyContactTwoRemoveLink,
  emergencyContactThreeRemoveLink,
  emergencyContactFourRemoveLink,
  emergencyContactOneChangeLink,
  emergencyContactTwoChangeLink,
  emergencyContactThreeChangeLink,
  emergencyContactFourChangeLink,
  markSectionCompleteRButtonYes,
  iWillComeBackLaterRBtn,
  saveButton,
}
