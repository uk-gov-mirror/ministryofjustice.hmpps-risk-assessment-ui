const addGPDetails = '.govuk-button--secondary'
const gpDetailsDeclineCheckBox = '#gp_details_declined'
const gpDetailsDeclndSummError = '[href="#gp_details_declined-error"]'
const gpDetailsDeclndFieldError = '[id="gp_details_declined-error"]'
const gpName = (index) => `#main-content form > dl:nth-child(${2 * index + 1}) > div:nth-child(1) > dd`
const gpPracticeName = (index) => `#main-content form > dl:nth-child(${2 * index + 1}) > div:nth-child(2) > dd`
const gpAddress = (index) => `#main-content form > dl:nth-child(${2 * index + 1}) > div:nth-child(3) > dd`
const gpPhoneNr = (index) => `#main-content form > dl:nth-child(${2 * index + 1}) > div:nth-child(4) > dd`
const gpContactChangeLink = (index) => `[href="edit-gp-details/${index - 1}"]`
const gpContactRemoveLink = (index) => `[href="remove-gp-details/${index - 1}"]`
const markSectionCompleteRButtonYes = '#gp_details_complete'
const iWillComeBackLaterRBtn = '#gp_details_complete-2'

module.exports = {
  clickAddGPDetails: () => {
    cy.get(addGPDetails).click()
  },

  clickGPDetailsDecline: () => {
    cy.get(gpDetailsDeclineCheckBox).check()
  },

  selectGPDetailsSectionComplete: (option) => {
    if (option === 'Yes') {
      cy.get(markSectionCompleteRButtonYes).check()
    } else {
      cy.get(iWillComeBackLaterRBtn).check()
    }
  },

  gpName,
  addGPDetails,
  gpDetailsDeclineCheckBox,
  gpDetailsDeclndSummError,
  gpDetailsDeclndFieldError,
  gpPracticeName,
  gpAddress,
  gpPhoneNr,
  gpContactChangeLink,
  gpContactRemoveLink,
  markSectionCompleteRButtonYes,
  iWillComeBackLaterRBtn,
}
