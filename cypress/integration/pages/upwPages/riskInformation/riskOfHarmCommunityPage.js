const historyOfSexOffendingRBtnYes = '#history_sexual_offending'
const historyOfSexOffendingRBtnNo = '#history_sexual_offending-2'
const historyOfSexOffendingDetails = '#history_sexual_offending_details'
const historyOfSexOffendingSummError = '[href="#history_sexual_offending-error"]'
const historyOfSexOffendingFieldError = '[id="history_sexual_offending-error"]'
const historyOfSexOffendingDetailsSummError = '[href="#history_sexual_offending_details-error"]'
const historyOfSexOffendingDetailsFieldError = '[id="history_sexual_offending_details-error"]'
const riskToChildrenRBtnYes = '#poses_risk_to_children'
const riskToChildrenRBtnNo = '#poses_risk_to_children-2'
const riskToChildrenDetails = '#poses_risk_to_children_details'
const riskToChildrenSummError = '[href="#poses_risk_to_children-error"]'
const riskToChildrenFieldError = '[id="poses_risk_to_children-error"]'
const riskToChildrenDetailsSummError = '[href="#poses_risk_to_children_details-error"]'
const riskToChildrenDetailsFieldError = '[id="poses_risk_to_children_details-error"]'
const violentOffencesRBtnYes = '#violent_offences'
const violentOffencesRBtnNo = '#violent_offences-2'
const violentOffencesDetails = '#violent_offences_details'
const violentOffencesSummError = '[href="#violent_offences-error"]'
const violentOffencesFieldError = '[id="violent_offences-error"]'
const violentOffencesDetailsSummError = '[href="#violent_offences_details-error"]'
const violentOffencesDetailsFieldError = '[id="violent_offences_details-error"]'
const acquisitiveOffendingRBtnYes = '#acquisitive_offending'
const acquisitiveOffendingRBtnNo = '#acquisitive_offending-2'
const acquisitiveOffendingDetails = '#acquisitive_offending_details'
const acquisitiveOffendingSummError = '[href="#acquisitive_offending-error"]'
const acquisitiveOffendingFieldError = '[id="acquisitive_offending-error"]'
const acquisitiveOffendingDetailsSummError = '[href="#acquisitive_offending_details-error"]'
const acquisitiveOffendingDetailsFieldError = '[id="acquisitive_offending_details-error"]'
const seriousGroupOffendingRBtnYes = '#sgo_identifier'
const seriousGroupOffendingRBtnNo = '#sgo_identifier-2'
const seriousGroupOffendingDetails = '#sgo_identifier_details'
const seriousGroupOffendingSummError = '[href="#sgo_identifier-error"]'
const seriousGroupOffendingFieldError = '[id="sgo_identifier-error"]'
const seriousGroupOffendingDetailsSummError = '[href="#sgo_identifier_details-error"]'
const seriousGroupOffendingDetailsFieldError = '[id="sgo_identifier_details-error"]'
const controlIssuesRBtnYes = '#control_issues'
const controlIssuesRBtnNo = '#control_issues-2'
const controlIssuesDetails = '#control_issues_details'
const controlIssuesSummError = '[href="#control_issues-error"]'
const controlIssuesFieldError = '[id="control_issues-error"]'
const controlIssuesDetailsSummError = '[href="#control_issues_details-error"]'
const controlIssuesDetailsFieldError = '[id="control_issues_details-error"]'
const hateBehaviourRBtnYes = '#history_of_hate_based_behaviour'
const hateBehaviourRBtnNo = '#history_of_hate_based_behaviour-2'
const hateBehaviourDetails = '#history_of_hate_based_behaviour_details'
const hateBehaviourSummError = '[href="#history_of_hate_based_behaviour-error"]'
const hateBehaviourFieldError = '[id="history_of_hate_based_behaviour-error"]'
const hateBehaviourDetailsSummError = '[href="#history_of_hate_based_behaviour_details-error"]'
const hateBehaviourDetailsFieldError = '[id="history_of_hate_based_behaviour_details-error"]'
const highProfilePersonRBtnYes = '#high_profile_person'
const highProfilePersonRBtnNo = '#high_profile_person-2'
const highProfilePersonDetails = '#high_profile_person_details'
const highProfilePersonSummError = '[href="#high_profile_person-error"]'
const highProfilePersonFieldError = '[id="high_profile_person-error"]'
const highProfilePersonDetailsSummError = '[href="#high_profile_person_details-error"]'
const highProfilePersonDetailsFieldError = '[id="high_profile_person_details-error"]'
const additionalRoshInfoRBtnYes = '#additional_rosh_info'
const additionalRoshInfoRBtnNo = '#additional_rosh_info-2'
const additionalRoshInfoDetails = '#additional_rosh_info_details'
const additionalRoshInfoSummError = '[href="#additional_rosh_info-error"]'
const additionalRoshInfoFieldError = '[id="additional_rosh_info-error"]'
const additionalRoshInfoDetailsSummError = '[href="#additional_rosh_info_details-error"]'
const additionalRoshInfoDetailsFieldError = '[id="additional_rosh_info_details-error"]'
const markSectionCompleteRButtonYes = '#rosh_community_complete'
const iWillComeBackLaterRBtn = '#rosh_community_complete-2'

module.exports = {
  selectHistoryOfSexOffendingStatus: (option) => {
    if (option === 'Yes') {
      cy.get(historyOfSexOffendingRBtnYes).check()
    } else if (option === 'No') {
      cy.get(historyOfSexOffendingRBtnNo).check()
    }
  },

  enterHistoryOfSexOffendingDetails: (details) => {
    cy.get(historyOfSexOffendingDetails).as('historyOfSexOffendingDetails').clear()
    cy.get('@historyOfSexOffendingDetails').type(details)
  },

  selectRiskToChildrenStatus: (option) => {
    if (option === 'Yes') {
      cy.get(riskToChildrenRBtnYes).check()
    } else if (option === 'No') {
      cy.get(riskToChildrenRBtnNo).check()
    }
  },

  enterRiskToChildrenDetails: (details) => {
    cy.get(riskToChildrenDetails).as('riskToChildrenDetails').clear()
    cy.get('@riskToChildrenDetails').type(details)
  },

  selectViolentOffencesStatus: (option) => {
    if (option === 'Yes') {
      cy.get(violentOffencesRBtnYes).check()
    } else if (option === 'No') {
      cy.get(violentOffencesRBtnNo).check()
    }
  },

  enterViolentOffencesDetails: (details) => {
    cy.get(violentOffencesDetails).as('violentOffencesDetails').clear()
    cy.get('@violentOffencesDetails').type(details)
  },

  selectAcquisitiveOffendingStatus: (option) => {
    if (option === 'Yes') {
      cy.get(acquisitiveOffendingRBtnYes).check()
    } else if (option === 'No') {
      cy.get(acquisitiveOffendingRBtnNo).check()
    }
  },

  enterAcquisitiveOffendingDetails: (details) => {
    cy.get(acquisitiveOffendingDetails).as('acquisitiveOffendingDetails').clear()
    cy.get('@acquisitiveOffendingDetails').type(details)
  },

  selectSeriousGroupOffendingStatus: (option) => {
    if (option === 'Yes') {
      cy.get(seriousGroupOffendingRBtnYes).check()
    } else if (option === 'No') {
      cy.get(seriousGroupOffendingRBtnNo).check()
    }
  },

  enterSeriousGroupOffendingDetails: (details) => {
    cy.get(seriousGroupOffendingDetails).as('seriousGroupOffendingDetails').clear()
    cy.get('@seriousGroupOffendingDetails').type(details)
  },

  selectControlIssuesStatus: (option) => {
    if (option === 'Yes') {
      cy.get(controlIssuesRBtnYes).check()
    } else if (option === 'No') {
      cy.get(controlIssuesRBtnNo).check()
    }
  },

  enterControlIssuesDetails: (details) => {
    cy.get(controlIssuesDetails).as('controlIssuesDetails').clear()
    cy.get('@controlIssuesDetails').type(details)
  },

  selectHateBehaviourStatus: (option) => {
    if (option === 'Yes') {
      cy.get(hateBehaviourRBtnYes).check()
    } else if (option === 'No') {
      cy.get(hateBehaviourRBtnNo).check()
    }
  },

  enterHateBehaviourDetails: (details) => {
    cy.get(hateBehaviourDetails).as('hateBehaviourDetails').clear()
    cy.get('@hateBehaviourDetails').type(details)
  },

  selectHighProfilePersonStatus: (option) => {
    if (option === 'Yes') {
      cy.get(highProfilePersonRBtnYes).check()
    } else if (option === 'No') {
      cy.get(highProfilePersonRBtnNo).check()
    }
  },

  enterHighProfilePersonDetails: (details) => {
    cy.get(highProfilePersonDetails).as('highProfilePersonDetails').clear()
    cy.get('@highProfilePersonDetails').type(details)
  },

  selectAdditionalRiskAssesInfoStatus: (option) => {
    if (option === 'Yes') {
      cy.get(additionalRoshInfoRBtnYes).check()
    } else if (option === 'No') {
      cy.get(additionalRoshInfoRBtnNo).check()
    }
  },

  enterAdditionalRiskAssesInfoDetails: (details) => {
    cy.get(additionalRoshInfoDetails).as('additionalRoshInfoDetails').clear()
    cy.get('@additionalRoshInfoDetails').type(details)
  },

  clearExistingValuesInAllDetailsTextBoxes: () => {
    cy.get(historyOfSexOffendingDetails).clear()
    cy.get(riskToChildrenDetails).clear()
    cy.get(violentOffencesDetails).clear()
    cy.get(acquisitiveOffendingDetails).clear()
    cy.get(seriousGroupOffendingDetails).clear()
    cy.get(controlIssuesDetails).clear()
    cy.get(hateBehaviourDetails).clear()
    cy.get(highProfilePersonDetails).clear()
    cy.get(additionalRoshInfoDetails).clear()
  },

  selectRiskOfHarmMarkSectionComplete: (option) => {
    if (option === 'Yes') {
      cy.get(markSectionCompleteRButtonYes).check()
    } else {
      cy.get(iWillComeBackLaterRBtn).check()
    }
  },
  historyOfSexOffendingRBtnYes,
  historyOfSexOffendingRBtnNo,
  historyOfSexOffendingDetails,
  historyOfSexOffendingSummError,
  historyOfSexOffendingFieldError,
  historyOfSexOffendingDetailsSummError,
  historyOfSexOffendingDetailsFieldError,
  riskToChildrenRBtnYes,
  riskToChildrenRBtnNo,
  riskToChildrenDetails,
  riskToChildrenSummError,
  riskToChildrenFieldError,
  riskToChildrenDetailsSummError,
  riskToChildrenDetailsFieldError,
  violentOffencesRBtnYes,
  violentOffencesRBtnNo,
  violentOffencesDetails,
  violentOffencesSummError,
  violentOffencesFieldError,
  violentOffencesDetailsSummError,
  violentOffencesDetailsFieldError,
  acquisitiveOffendingRBtnYes,
  acquisitiveOffendingRBtnNo,
  acquisitiveOffendingDetails,
  acquisitiveOffendingSummError,
  acquisitiveOffendingFieldError,
  acquisitiveOffendingDetailsSummError,
  acquisitiveOffendingDetailsFieldError,
  seriousGroupOffendingRBtnYes,
  seriousGroupOffendingRBtnNo,
  seriousGroupOffendingDetails,
  seriousGroupOffendingSummError,
  seriousGroupOffendingFieldError,
  seriousGroupOffendingDetailsSummError,
  seriousGroupOffendingDetailsFieldError,
  controlIssuesRBtnYes,
  controlIssuesRBtnNo,
  controlIssuesDetails,
  controlIssuesSummError,
  controlIssuesFieldError,
  controlIssuesDetailsSummError,
  controlIssuesDetailsFieldError,
  hateBehaviourRBtnYes,
  hateBehaviourRBtnNo,
  hateBehaviourDetails,
  hateBehaviourSummError,
  hateBehaviourFieldError,
  hateBehaviourDetailsSummError,
  hateBehaviourDetailsFieldError,
  highProfilePersonRBtnYes,
  highProfilePersonRBtnNo,
  highProfilePersonDetails,
  highProfilePersonSummError,
  highProfilePersonFieldError,
  highProfilePersonDetailsSummError,
  highProfilePersonDetailsFieldError,
  additionalRoshInfoRBtnYes,
  additionalRoshInfoRBtnNo,
  additionalRoshInfoDetails,
  additionalRoshInfoSummError,
  additionalRoshInfoFieldError,
  additionalRoshInfoDetailsSummError,
  additionalRoshInfoDetailsFieldError,
  markSectionCompleteRButtonYes,
  iWillComeBackLaterRBtn,
}
