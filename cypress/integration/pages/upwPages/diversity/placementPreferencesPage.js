const placementPreferRButtonYes = '#placement_preference'
const placementPreferRButtonNo = '#placement_preference-2'
const placementPreferSummError = '[href="#placement_preference-error"]'
const placementPreferFieldError = '[id="placement_preference-error"]'
const placementPreferCBoxSummError = '[href="#placement_preferences-error"]'
const placementPreferCBoxFieldError = '[id="placement_preferences-error"]'
const individualCheckBox = '#placement_preferences'
const mixedGroupCheckBox = '#placement_preferences-2'
const femaleOnlyGroupCheckBox = '#placement_preferences-3'
const markSectionCompleteRButtonYes = '#placement_preference_complete'
const iWillComeBackLater = '#placement_preference_complete-2'

module.exports = {
  selectPlacementPreferStatus: (option) => {
    if (option === 'Yes') {
      cy.get(placementPreferRButtonYes).check()
    } else {
      cy.get(placementPreferRButtonNo).check()
    }
  },

  selectPlacementPrefMarkSectionComplete: (option) => {
    if (option === 'Yes') {
      cy.get(markSectionCompleteRButtonYes).check()
    } else {
      cy.get(iWillComeBackLater).check()
    }
  },

  selectPlacementPreference: (option) => {
    if (option === 'Individual') {
      cy.get(individualCheckBox).check()
    } else if (option === 'Mixed group') {
      cy.get(mixedGroupCheckBox).check()
    } else if (option === 'Female only group') {
      cy.get(femaleOnlyGroupCheckBox).check()
    }
  },
  placementPreferRButtonYes,
  placementPreferRButtonNo,
  placementPreferSummError,
  placementPreferFieldError,
  individualCheckBox,
  mixedGroupCheckBox,
  femaleOnlyGroupCheckBox,
  placementPreferCBoxSummError,
  placementPreferCBoxFieldError,
  markSectionCompleteRButtonYes,
  iWillComeBackLater,
}
