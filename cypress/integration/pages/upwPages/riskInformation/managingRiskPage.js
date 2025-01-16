const locationExclCriteriaRBtnYes = '#location_exclusion_criteria'
const locationExclCriteriaRBtnNo = '#location_exclusion_criteria-2'
const locationExclCriteriaDetails = '#location_exclusion_criteria_details'
const locationExclCriteriaSummError = '[href="#location_exclusion_criteria-error"]'
const locationExclCriteriaFieldError = '[id="location_exclusion_criteria-error"]'
const locationExclCriteriaDetailsSummError = '[href="#location_exclusion_criteria_details-error"]'
const locationExclCriteriaDetailsFieldError = '[id="location_exclusion_criteria_details-error"]'
const restrictedPlacementRBtnYes = '#restricted_placement'
const restrictedPlacementRBtnNo = '#restricted_placement-2'
const restrictedPlacemenDetails = '#restricted_placement_details'
const restrictedPlacementSummError = '[href="#restricted_placement-error"]'
const restrictedPlacementFieldError = '[id="restricted_placement-error"]'
const restrictedPlacementDetailsSummError = '[href="#restricted_placement_details-error"]'
const restrictedPlacementDetailsFieldError = '[id="restricted_placement_details-error"]'
const noFemaleSupervisorRBtnYes = '#no_female_supervisor'
const noFemaleSupervisorRBtnNo = '#no_female_supervisor-2'
const noFemaleSupervisorDetails = '#no_female_supervisor_details'
const noFemaleSupervisorSummError = '[href="#no_female_supervisor-error"]'
const noFemaleSupervisorFieldError = '[id="no_female_supervisor-error"]'
const noFemaleSupervisorDetailsSummError = '[href="#no_female_supervisor_details-error"]'
const noFemaleSupervisorDetailsFieldError = '[id="no_female_supervisor_details-error"]'
const noMaleSupervisorRBtnYes = '#no_male_supervisor'
const noMmaleSupervisorRBtnNo = '#no_male_supervisor-2'
const noMaleSupervisorDetails = '#no_male_supervisor_details'
const noMaleSupervisorSummError = '[href="#no_male_supervisor-error"]'
const noMaleSupervisorFieldError = '[id="no_male_supervisor-error"]'
const noMaleSupervisorDetailsSummError = '[href="#no_male_supervisor_details-error"]'
const noMaleSupervisorDetailsFieldError = '[id="no_male_supervisor_details-error"]'
const restrictiveOrdersRBtnYes = '#restrictive_orders'
const restrictiveOrdersRBtnNo = '#restrictive_orders-2'
const restrictiveOrderDetails = '#restrictive_orders_details'
const restrictiveOrdersSummError = '[href="#restrictive_orders-error"]'
const restrictiveOrdersFieldError = '[id="restrictive_orders-error"]'
const restrictiveOrdersDetailsSummError = '[href="#restrictive_orders_details-error"]'
const restrictiveOrdersDetailsFieldError = '[id="restrictive_orders_details-error"]'
const riskMgmtIssuesIndividualRBtnYes = '#risk_management_issues_individual'
const riskMgmtIssuesIndividualRBtnNo = '#risk_management_issues_individual-2'
const riskMgmtIssuesIndividualDetails = '#risk_management_issues_individual_details'
const riskMgmtIssuesIndividualSummError = '[href="#risk_management_issues_individual-error"]'
const riskMgmtIssuesIndividualFieldError = '[id="risk_management_issues_individual-error"]'
const riskMgmtIssuesIndividualDetailsSummError = '[href="#risk_management_issues_individual_details-error"]'
const riskMgmtIssuesIndividualDetailsFieldError = '[id="risk_management_issues_individual_details-error"]'
const riskMgmtIssuesSupervisedRBtnYes = '#risk_management_issues_supervised_group'
const riskMgmtIssuesSupervisedRBtnNo = '#risk_management_issues_supervised_group-2'
const riskMgmtIssuesSupervisedDetails = '#risk_management_issues_supervised_group_details'
const riskMgmtIssuesSupervisedSummError = '[href="#risk_management_issues_supervised_group-error"'
const riskMgmtIssuesSupervisedFieldError = '[id="risk_management_issues_supervised_group-error"]'
const riskMgmtIssuesSupervisedDetailsSummError = '[href="#risk_management_issues_supervised_group_details-error"]'
const riskMgmtIssuesSupervisedDetailsFieldError = '[id="risk_management_issues_supervised_group_details-error"]'
const alcoholDrugIssuesRBtnYes = '#alcohol_drug_issues'
const alcoholDrugIssuesRBtnNo = '#alcohol_drug_issues-2'
const alcoholDrugIssuesDetails = '#alcohol_drug_issues_details'
const alcoholDrugIssuesSummError = '[href="#alcohol_drug_issues-error"]'
const alcoholDrugIssuesFieldError = '[id="alcohol_drug_issues-error"]'
const alcoholDrugIssuesDetailsSummError = '[href="#alcohol_drug_issues_details-error"]'
const alcoholDrugIssuesDetailsFieldError = '[id="alcohol_drug_issues_details-error"]'
const markSectionCompleteRButtonYes = '#managing_risk_complete'
const iWillComeBackLaterRButtonNo = '#managing_risk_complete-2'

module.exports = {
  selectLocationExclusionCriteriaStatus: (option) => {
    if (option === 'Yes') {
      cy.get(locationExclCriteriaRBtnYes).check()
    } else if (option === 'No') {
      cy.get(locationExclCriteriaRBtnNo).check()
    }
  },

  enterlocationExclCriteriaDetails: (details) => {
    cy.get(locationExclCriteriaDetails).as('locationExclCriteriaDetails').clear()
    cy.get('@locationExclCriteriaDetails').type(details)
  },

  selectRestrictedPlacementStatus: (option) => {
    if (option === 'Yes') {
      cy.get(restrictedPlacementRBtnYes).check()
    } else if (option === 'No') {
      cy.get(restrictedPlacementRBtnNo).check()
    }
  },

  enterRestrictedPlacementDetails: (details) => {
    cy.get(restrictedPlacemenDetails).as('restrictedPlacemenDetails').clear()
    cy.get('@restrictedPlacemenDetails').type(details)
  },

  selectNoFemaleSupervisorStatus: (option) => {
    if (option === 'Yes') {
      cy.get(noFemaleSupervisorRBtnYes).check()
    } else if (option === 'No') {
      cy.get(noFemaleSupervisorRBtnNo).check()
    }
  },

  enterNoFemaleSupervisorDetails: (details) => {
    cy.get(noFemaleSupervisorDetails).as('noFemaleSupervisorDetails').clear()
    cy.get('@noFemaleSupervisorDetails').type(details)
  },

  selectNoMaleSupervisorStatus: (option) => {
    if (option === 'Yes') {
      cy.get(noMaleSupervisorRBtnYes).check()
    } else if (option === 'No') {
      cy.get(noMmaleSupervisorRBtnNo).check()
    }
  },

  enterNoMaleSupervisorDetails: (details) => {
    cy.get(noMaleSupervisorDetails).as('noMaleSupervisorDetails').clear()
    cy.get('@noMaleSupervisorDetails').type(details)
  },

  selectRestrictiveOrdertatus: (option) => {
    if (option === 'Yes') {
      cy.get(restrictiveOrdersRBtnYes).check()
    } else if (option === 'No') {
      cy.get(restrictiveOrdersRBtnNo).check()
    }
  },

  enterRestrictiveOrderDetails: (details) => {
    cy.get(restrictiveOrderDetails).as('restrictiveOrderDetails').clear()
    cy.get('@restrictiveOrderDetails').type(details)
  },

  selectRiskMgmtIssuesIndividualStatus: (option) => {
    if (option === 'Yes') {
      cy.get(riskMgmtIssuesIndividualRBtnYes).check()
    } else if (option === 'No') {
      cy.get(riskMgmtIssuesIndividualRBtnNo).check()
    }
  },

  enterRiskMgmtIssuesIndividualDetails: (details) => {
    cy.get(riskMgmtIssuesIndividualDetails).as('riskManagementIssuesIndividualDetails').clear()
    cy.get('@riskManagementIssuesIndividualDetails').type(details)
  },

  selectRiskMgmtIssuesSupervisedStatus: (option) => {
    if (option === 'Yes') {
      cy.get(riskMgmtIssuesSupervisedRBtnYes).check()
    } else if (option === 'No') {
      cy.get(riskMgmtIssuesSupervisedRBtnNo).check()
    }
  },

  enterRiskMgmtIssuesSupervisedDetails: (details) => {
    cy.get(riskMgmtIssuesSupervisedDetails).as('riskManagementIssuesSupervisedDetails').clear()
    cy.get('@riskManagementIssuesSupervisedDetails').type(details)
  },

  selectAlcoholDrugIssuesStatus: (option) => {
    if (option === 'Yes') {
      cy.get(alcoholDrugIssuesRBtnYes).check()
    } else if (option === 'No') {
      cy.get(alcoholDrugIssuesRBtnNo).check()
    }
  },

  enterAlcoholDrugIssuesDetails: (details) => {
    cy.get(alcoholDrugIssuesDetails).as('alcoholDrugIssuesDetails').clear()
    cy.get('@alcoholDrugIssuesDetails').type(details)
  },

  selectManagingRiskSectionComplete: (option) => {
    if (option === 'Yes') {
      cy.get(markSectionCompleteRButtonYes).check()
    } else {
      cy.get(iWillComeBackLaterRButtonNo).check()
    }
  },
  locationExclCriteriaRBtnYes,
  locationExclCriteriaRBtnNo,
  locationExclCriteriaDetails,
  locationExclCriteriaSummError,
  locationExclCriteriaFieldError,
  locationExclCriteriaDetailsSummError,
  locationExclCriteriaDetailsFieldError,
  restrictedPlacementRBtnYes,
  restrictedPlacementRBtnNo,
  restrictedPlacemenDetails,
  restrictedPlacementSummError,
  restrictedPlacementFieldError,
  restrictedPlacementDetailsSummError,
  restrictedPlacementDetailsFieldError,
  noFemaleSupervisorRBtnYes,
  noFemaleSupervisorRBtnNo,
  noFemaleSupervisorDetails,
  noFemaleSupervisorSummError,
  noFemaleSupervisorFieldError,
  noFemaleSupervisorDetailsSummError,
  noFemaleSupervisorDetailsFieldError,
  noMaleSupervisorRBtnYes,
  noMmaleSupervisorRBtnNo,
  noMaleSupervisorDetails,
  noMaleSupervisorSummError,
  noMaleSupervisorFieldError,
  noMaleSupervisorDetailsSummError,
  noMaleSupervisorDetailsFieldError,
  restrictiveOrdersRBtnYes,
  restrictiveOrdersRBtnNo,
  restrictiveOrderDetails,
  restrictiveOrdersSummError,
  restrictiveOrdersFieldError,
  restrictiveOrdersDetailsSummError,
  restrictiveOrdersDetailsFieldError,
  riskMgmtIssuesIndividualRBtnYes,
  riskMgmtIssuesIndividualRBtnNo,
  riskMgmtIssuesIndividualDetails,
  riskMgmtIssuesIndividualSummError,
  riskMgmtIssuesIndividualFieldError,
  riskMgmtIssuesIndividualDetailsSummError,
  riskMgmtIssuesIndividualDetailsFieldError,
  riskMgmtIssuesSupervisedRBtnYes,
  riskMgmtIssuesSupervisedRBtnNo,
  riskMgmtIssuesSupervisedDetails,
  riskMgmtIssuesSupervisedSummError,
  riskMgmtIssuesSupervisedFieldError,
  riskMgmtIssuesSupervisedDetailsSummError,
  riskMgmtIssuesSupervisedDetailsFieldError,
  alcoholDrugIssuesRBtnYes,
  alcoholDrugIssuesRBtnNo,
  alcoholDrugIssuesDetails,
  alcoholDrugIssuesSummError,
  alcoholDrugIssuesFieldError,
  alcoholDrugIssuesDetailsSummError,
  alcoholDrugIssuesDetailsFieldError,
  markSectionCompleteRButtonYes,
  iWillComeBackLaterRButtonNo,
}
