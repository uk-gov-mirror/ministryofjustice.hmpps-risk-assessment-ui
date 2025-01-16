const cultReligiousAdjstRBtnYes = '#cultural_religious_adjustment'
const cultReligiousAdjstRBtnNo = '#cultural_religious_adjustment-2'
const cultReligiousAdjstSummError = '[href="#cultural_religious_adjustment-error"]'
const cultReligiousAdjstFieldError = '[id="cultural_religious_adjustment-error"]'
const cultReligiousAdjstDetails = '#cultural_religious_adjustment_details'
const cultReligiousAdjstDetailsSummError = '[href="#cultural_religious_adjustment_details-error"]'
const cultReligiousAdjstDetailsFieldError = '[id="cultural_religious_adjustment_details-error"]'
const markSectionCompleteRBtnYes = '#cultural_religious_adjustment_complete'
const iWillComeBackLaterRBtn = '#cultural_religious_adjustment_complete-2'

module.exports = {
  selectCulturalReligiousAdjstStatus: (option) => {
    if (option === 'Yes') {
      cy.get(cultReligiousAdjstRBtnYes).check()
    } else {
      cy.get(cultReligiousAdjstRBtnNo).check()
    }
  },

  enterCulturalAndReligiousDetails: (details) => {
    cy.get(cultReligiousAdjstDetails).as('cultReligiousAdjustmentsDetails')
    cy.get('@cultReligiousAdjustmentsDetails').clear()
    cy.get('@cultReligiousAdjustmentsDetails').type(details)
  },

  selectCulturalReligiousMarkSectionComplete: (option) => {
    if (option === 'Yes') {
      cy.get(markSectionCompleteRBtnYes).check()
    } else {
      cy.get(iWillComeBackLaterRBtn).check()
    }
  },
  cultReligiousAdjstRBtnYes,
  cultReligiousAdjstRBtnNo,
  cultReligiousAdjstDetails,
  cultReligiousAdjstSummError,
  cultReligiousAdjstFieldError,
  cultReligiousAdjstDetailsSummError,
  cultReligiousAdjstDetailsFieldError,
  markSectionCompleteRBtnYes,
  iWillComeBackLaterRBtn,
}
