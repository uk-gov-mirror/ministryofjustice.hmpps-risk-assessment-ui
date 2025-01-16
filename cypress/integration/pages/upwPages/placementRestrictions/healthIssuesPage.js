const allergiesRBtnYes = '#allergies'
const allergiesRBtnNo = '#allergies-2'
const allergiesDetails = '#allergies_details'
const allergiesSummError = '[href="#allergies-error"]'
const allergiesFieldError = '[id="allergies-error"]'
const allergiesDetailsSummError = '[href="#allergies_details-error"]'
const allergiesDetailsFieldError = '[id="allergies_details-error"]'
const lossOfConsciousnessRBtnYes = '#loss_consciousness'
const lossOfConsciousnessRBtnNo = '#loss_consciousness-2'
const lossOfConsciousnessDetails = '#loss_consciousness_details'
const lossOfConsciousnessSummError = '[href="#loss_consciousness-error"]'
const lossOfConsciousnessFieldError = '[id="loss_consciousness-error"]'
const lossOfConsciousnessDetailsSummError = '[href="#loss_consciousness_details-error"]'
const lossOfConsciousnessDetailsFieldError = '[id="loss_consciousness_details-error"]'
const epilepsyRBtnYes = '#epilepsy'
const epilepsyRBtnNo = '#epilepsy-2'
const epilepsyDetails = '#epilepsy_details'
const epilepsySummError = '[href="#epilepsy-error"]'
const epilepsyFieldError = '[id="epilepsy-error"]'
const epilepsyDetailsSummError = '[href="#epilepsy_details-error"]'
const epilepsyDetailsFieldError = '[id="epilepsy_details-error"]'
const pregnancyRBtnYes = '#pregnancy'
const recentlyGivenBirthBtn = '#pregnancy-2'
const pregnancyRecentBirthRBtnNo = '#pregnancy-3'
const pregnancyDetails = '#pregnancy_pregnant_details'
const recentlyGivenBirthDetails = '#pregnancy_recently_given_birth_details'
const pregnancySummError = '[href="#pregnancy-error"]'
const pregnancyFieldError = '[id="pregnancy-error"]'
const pregnancyDetailsSummError = '[href="#pregnancy_pregnant_details-error"]'
const pregnancyDetailsFieldError = '[id="pregnancy_pregnant_details-error"]'
const recentlyGivenBirthDetailsSummError = '[href="#pregnancy_recently_given_birth_details-error"]'
const recentlyGivenBirthDetailsFieldError = '[id="pregnancy_recently_given_birth_details-error"]'
const otherHealthIssuesRBtnYes = '#other_health_issues'
const otherHealthIssuesRBtnNo = '#other_health_issues-2'
const otherHealthIssuesDetails = '#other_health_issues_details'
const otherHealthIssuesSummError = '[href="#other_health_issues-error"]'
const otherHealthIssuesFieldError = '[id="other_health_issues-error"]'
const otherHealthIssuesDetailsSummError = '[href="#other_health_issues_details-error"]'
const otherHealthIssuesDetailsFieldError = '[id="other_health_issues_details-error"]'
const markSectionCompleteRButtonYes = '#health_issues_complete'
const iWillComeBackLaterRButtonNo = '#health_issues_complete-2'

module.exports = {
  selectAllergiesStatus: (option) => {
    if (option === 'Yes') {
      cy.get(allergiesRBtnYes).check()
    } else if (option === 'No') {
      cy.get(allergiesRBtnNo).check()
    }
  },

  enterAllergiesDetails: (details) => {
    cy.get(allergiesDetails).as('allergiesDetails').clear()
    cy.get('@allergiesDetails').type(details)
  },

  selectLossOfConsciousnessStatus: (option) => {
    if (option === 'Yes') {
      cy.get(lossOfConsciousnessRBtnYes).check()
    } else if (option === 'No') {
      cy.get(lossOfConsciousnessRBtnNo).check()
    }
  },

  enterLossOfConsciousnessDetails: (details) => {
    cy.get(lossOfConsciousnessDetails).as('lossOfConsciousnessDetails').clear()
    cy.get('@lossOfConsciousnessDetails').type(details)
  },

  selectEpilepsyStatus: (option) => {
    if (option === 'Yes') {
      cy.get(epilepsyRBtnYes).check()
    } else if (option === 'No') {
      cy.get(epilepsyRBtnNo).check()
    }
  },

  enterEpilepsyDetails: (details) => {
    cy.get(epilepsyDetails).as('epilepsyDetails').clear()
    cy.get('@epilepsyDetails').type(details)
  },

  selectPregnancyStatus: (option) => {
    if (option === 'Pregnant') {
      cy.get(pregnancyRBtnYes).check()
    } else if (option === 'Recently given birth') {
      cy.get(recentlyGivenBirthBtn).check()
    } else if (option === 'No') {
      cy.get(pregnancyRecentBirthRBtnNo).check()
    }
  },

  enterPregnancyDetails: (details) => {
    cy.get(pregnancyDetails).as('pregnancyDetails').clear()
    cy.get('@pregnancyDetails').type(details)
  },

  selectOtherHealthIssuesStatus: (option) => {
    if (option === 'Yes') {
      cy.get(otherHealthIssuesRBtnYes).check()
    } else if (option === 'No') {
      cy.get(otherHealthIssuesRBtnNo).check()
    }
  },

  enterOtherHealthIssuesDetails: (details) => {
    cy.get(otherHealthIssuesDetails).as('otherHealthIssuesDetails').clear()
    cy.get('@otherHealthIssuesDetails').type(details)
  },

  selectHealthIssuesSectionComplete: (option) => {
    if (option === 'Yes') {
      cy.get(markSectionCompleteRButtonYes).check()
    } else {
      cy.get(iWillComeBackLaterRButtonNo).check()
    }
  },
  allergiesRBtnYes,
  allergiesRBtnNo,
  allergiesDetails,
  allergiesSummError,
  allergiesFieldError,
  allergiesDetailsSummError,
  allergiesDetailsFieldError,
  lossOfConsciousnessRBtnYes,
  lossOfConsciousnessRBtnNo,
  lossOfConsciousnessDetails,
  lossOfConsciousnessSummError,
  lossOfConsciousnessFieldError,
  lossOfConsciousnessDetailsSummError,
  lossOfConsciousnessDetailsFieldError,
  epilepsyRBtnYes,
  epilepsyRBtnNo,
  epilepsyDetails,
  epilepsySummError,
  epilepsyFieldError,
  epilepsyDetailsSummError,
  epilepsyDetailsFieldError,
  pregnancyRBtnYes,
  recentlyGivenBirthBtn,
  pregnancyRecentBirthRBtnNo,
  pregnancyDetails,
  recentlyGivenBirthDetails,
  pregnancySummError,
  pregnancyFieldError,
  pregnancyDetailsSummError,
  pregnancyDetailsFieldError,
  recentlyGivenBirthDetailsSummError,
  recentlyGivenBirthDetailsFieldError,
  otherHealthIssuesRBtnYes,
  otherHealthIssuesRBtnNo,
  otherHealthIssuesDetails,
  otherHealthIssuesSummError,
  otherHealthIssuesFieldError,
  otherHealthIssuesDetailsSummError,
  otherHealthIssuesDetailsFieldError,
  markSectionCompleteRButtonYes,
  iWillComeBackLaterRButtonNo,
}
