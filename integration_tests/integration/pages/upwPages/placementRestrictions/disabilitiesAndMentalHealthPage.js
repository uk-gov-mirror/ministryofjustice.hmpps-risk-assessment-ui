const addtlDisabilitiesRBtnYes = '#additional_disabilities'
const addtlDisabilitiesRBtnNo = '#additional_disabilities-2'
const addtlDisabilityDetails = '#additional_disabilities_details'
const disabilitiesRBtnYes = '#disabilities'
const disabilitiesRBtnNo = '#disabilities-2'
const disabilityDetails = '#disabilities_details'
const markSectionCompleteRBtnYes = '#disabilities_complete'
const iWillComeBackLaterRBtn = '#disabilities_complete-2'

module.exports = {
  selectAddtlDisabilityStatus: (option) => {
    if (option === 'Yes') {
      cy.get(addtlDisabilitiesRBtnYes).check()
    } else if (option === 'No') {
      cy.get(addtlDisabilitiesRBtnNo).check()
    }
  },

  enterAddtlDisabilityDetails: (details) => {
    cy.get(addtlDisabilityDetails).as('additionalDisabilityDetails').clear()
    cy.get('@additionalDisabilityDetails').type(details)
  },

  selectDisabilityStatus: (option) => {
    if (option === 'Yes') {
      cy.get(disabilitiesRBtnYes).check()
    } else if (option === 'No') {
      cy.get(disabilitiesRBtnNo).check()
    }
  },

  enterDisabilityDetails: (details) => {
    cy.get(disabilityDetails).as('disabilityDetails').clear()
    cy.get('@disabilityDetails').type(details)
  },

  selectDisabilitiesSectionComplete: (option) => {
    if (option === 'Yes') {
      cy.get(markSectionCompleteRBtnYes).check()
    } else {
      cy.get(iWillComeBackLaterRBtn).check()
    }
  },
  addtlDisabilitiesRBtnYes,
  addtlDisabilitiesRBtnNo,
  addtlDisabilityDetails,
  disabilitiesRBtnYes,
  disabilitiesRBtnNo,
  disabilityDetails,
  markSectionCompleteRBtnYes,
  iWillComeBackLaterRBtn,
}
