const { When, Then } = require('@badeball/cypress-cucumber-preprocessor')
const Managingrisk = require('../../../integration/pages/upwPages/riskInformation/managingRiskPage')
const IndividualsDetailsPage = require('../../../integration/pages/upwPages/individualsDetails/individualsDetailsPage')
const Common = require('../../../integration/pages/upwPages/common/common')

When('I see that {string} is Default state on Managing risk page', () => {
  cy.get(Managingrisk.iWillComeBackLaterRButtonNo).should('have.attr', 'type', 'radio').should('be.checked')
})

When('I select {string} for Mark this section as complete? for Managing Risk', (option) => {
  Managingrisk.selectManagingRiskSectionComplete(option)
})

When('I select the Options and enter the details on the "Managing Risk" page as follows', (dataTable) => {
  const questions = dataTable.hashes()
  questions.forEach((question) => {
    cy.get('form').should('contain.text', question['Question Name'])
  })
  Managingrisk.selectLocationExclusionCriteriaStatus(dataTable.hashes()[0]['Select Option'])
  if (dataTable.hashes()[0]['Select Option'] === 'Yes') {
    cy.get(Managingrisk.locationExclCriteriaDetails).should('be.visible')
    Managingrisk.enterlocationExclCriteriaDetails(dataTable.hashes()[0]['Text to be entered in Give Details'])
  } else {
    cy.get(Managingrisk.locationExclCriteriaDetails).should('not.be.visible')
  }
  Managingrisk.selectRestrictedPlacementStatus(dataTable.hashes()[1]['Select Option'])
  if (dataTable.hashes()[1]['Select Option'] === 'Yes') {
    cy.get(Managingrisk.restrictedPlacemenDetails).should('be.visible')
    Managingrisk.enterRestrictedPlacementDetails(dataTable.hashes()[1]['Text to be entered in Give Details'])
  } else {
    cy.get(Managingrisk.restrictedPlacemenDetails).should('not.be.visible')
  }
  Managingrisk.selectNoFemaleSupervisorStatus(dataTable.hashes()[2]['Select Option'])
  if (dataTable.hashes()[2]['Select Option'] === 'Yes') {
    cy.get(Managingrisk.noFemaleSupervisorDetails).should('be.visible')
    Managingrisk.enterNoFemaleSupervisorDetails(dataTable.hashes()[2]['Text to be entered in Give Details'])
  } else {
    cy.get(Managingrisk.noFemaleSupervisorDetails).should('not.be.visible')
  }
  Managingrisk.selectNoMaleSupervisorStatus(dataTable.hashes()[3]['Select Option'])
  if (dataTable.hashes()[3]['Select Option'] === 'Yes') {
    cy.get(Managingrisk.noMaleSupervisorDetails).should('be.visible')
    Managingrisk.enterNoMaleSupervisorDetails(dataTable.hashes()[3]['Text to be entered in Give Details'])
  } else {
    cy.get(Managingrisk.noMaleSupervisorDetails).should('not.be.visible')
  }
  Managingrisk.selectRestrictiveOrdertatus(dataTable.hashes()[4]['Select Option'])
  if (dataTable.hashes()[4]['Select Option'] === 'Yes') {
    cy.get(Managingrisk.restrictiveOrderDetails).should('be.visible')
    Managingrisk.enterRestrictiveOrderDetails(dataTable.hashes()[4]['Text to be entered in Give Details'])
  } else {
    cy.get(Managingrisk.restrictiveOrderDetails).should('not.be.visible')
  }
  Managingrisk.selectRiskMgmtIssuesIndividualStatus(dataTable.hashes()[5]['Select Option'])
  if (dataTable.hashes()[5]['Select Option'] === 'Yes') {
    cy.get(Managingrisk.riskMgmtIssuesIndividualDetails).should('be.visible')
    Managingrisk.enterRiskMgmtIssuesIndividualDetails(dataTable.hashes()[5]['Text to be entered in Give Details'])
  } else {
    cy.get(Managingrisk.riskMgmtIssuesIndividualDetails).should('not.be.visible')
  }
  Managingrisk.selectRiskMgmtIssuesSupervisedStatus(dataTable.hashes()[6]['Select Option'])
  if (dataTable.hashes()[6]['Select Option'] === 'Yes') {
    cy.get(Managingrisk.riskMgmtIssuesSupervisedDetails).should('be.visible')
    Managingrisk.enterRiskMgmtIssuesSupervisedDetails(dataTable.hashes()[6]['Text to be entered in Give Details'])
  } else {
    cy.get(Managingrisk.riskMgmtIssuesSupervisedDetails).should('not.be.visible')
  }
  Managingrisk.selectAlcoholDrugIssuesStatus(dataTable.hashes()[7]['Select Option'])
  if (dataTable.hashes()[7]['Select Option'] === 'Yes') {
    cy.get(Managingrisk.alcoholDrugIssuesDetails).should('be.visible')
    Managingrisk.enterAlcoholDrugIssuesDetails(dataTable.hashes()[7]['Text to be entered in Give Details'])
  } else {
    cy.get(Managingrisk.alcoholDrugIssuesDetails).should('not.be.visible')
  }
})

Then(
  'I select the only "Yes" Options for all the Managing Risk questions and do not enter the details',
  (dataTable) => {
    Managingrisk.selectLocationExclusionCriteriaStatus(dataTable.hashes()[0]['Select Option'])
    Managingrisk.selectRestrictedPlacementStatus(dataTable.hashes()[1]['Select Option'])
    Managingrisk.selectNoFemaleSupervisorStatus(dataTable.hashes()[2]['Select Option'])
    Managingrisk.selectNoMaleSupervisorStatus(dataTable.hashes()[3]['Select Option'])
    Managingrisk.selectRestrictiveOrdertatus(dataTable.hashes()[4]['Select Option'])
    Managingrisk.selectRiskMgmtIssuesIndividualStatus(dataTable.hashes()[5]['Select Option'])
    Managingrisk.selectRiskMgmtIssuesSupervisedStatus(dataTable.hashes()[6]['Select Option'])
    Managingrisk.selectAlcoholDrugIssuesStatus(dataTable.hashes()[7]['Select Option'])
  },
)

Then('I see the following Managing Risk Summary and Field error messages for {string}', (errMsgType, dataTable) => {
  if (errMsgType === 'Questions') {
    cy.get(Managingrisk.locationExclCriteriaSummError).should(
      'contain.text',
      dataTable.hashes()[0]['Summary Error Messages'].replaceAll("'", '’'),
    )
    cy.get(Managingrisk.locationExclCriteriaFieldError).should(
      'contain.text',
      dataTable.hashes()[0]['Field Error Messages'].replaceAll("'", '’'),
    )
    cy.get(Managingrisk.restrictedPlacementSummError).should(
      'have.text',
      dataTable.hashes()[1]['Summary Error Messages'],
    )
    cy.get(Managingrisk.restrictedPlacementFieldError).should(
      'contain.text',
      dataTable.hashes()[1]['Field Error Messages'],
    )
    cy.get(Managingrisk.noFemaleSupervisorSummError).should(
      'have.text',
      dataTable.hashes()[2]['Summary Error Messages'],
    )
    cy.get(Managingrisk.noFemaleSupervisorFieldError).should(
      'contain.text',
      dataTable.hashes()[2]['Field Error Messages'],
    )
    cy.get(Managingrisk.noMaleSupervisorSummError).should('have.text', dataTable.hashes()[3]['Summary Error Messages'])
    cy.get(Managingrisk.noMaleSupervisorFieldError).should(
      'contain.text',
      dataTable.hashes()[3]['Field Error Messages'],
    )
    cy.get(Managingrisk.restrictiveOrdersSummError).should('have.text', dataTable.hashes()[4]['Summary Error Messages'])
    cy.get(Managingrisk.restrictiveOrdersFieldError).should(
      'contain.text',
      dataTable.hashes()[4]['Field Error Messages'],
    )
    cy.get(Managingrisk.riskMgmtIssuesIndividualSummError).should(
      'have.text',
      dataTable.hashes()[5]['Summary Error Messages'],
    )
    cy.get(Managingrisk.riskMgmtIssuesIndividualFieldError).should(
      'contain.text',
      dataTable.hashes()[5]['Field Error Messages'],
    )
    cy.get(Managingrisk.riskMgmtIssuesSupervisedSummError).should(
      'have.text',
      dataTable.hashes()[6]['Summary Error Messages'],
    )
    cy.get(Managingrisk.riskMgmtIssuesSupervisedFieldError).should(
      'contain.text',
      dataTable.hashes()[6]['Field Error Messages'],
    )
    cy.get(Managingrisk.alcoholDrugIssuesSummError).should('have.text', dataTable.hashes()[7]['Summary Error Messages'])
    cy.get(Managingrisk.alcoholDrugIssuesFieldError).should(
      'contain.text',
      dataTable.hashes()[7]['Field Error Messages'],
    )
  }
  if (errMsgType === 'Give Details') {
    cy.get(Managingrisk.locationExclCriteriaDetailsSummError).should(
      'have.text',
      dataTable.hashes()[0]['Summary Error Messages'],
    )
    cy.get(Managingrisk.locationExclCriteriaDetailsFieldError).should(
      'contain.text',
      dataTable.hashes()[0]['Field Error Messages'],
    )
    cy.get(Managingrisk.restrictedPlacementDetailsSummError).should(
      'have.text',
      dataTable.hashes()[1]['Summary Error Messages'],
    )
    cy.get(Managingrisk.restrictedPlacementDetailsFieldError).should(
      'contain.text',
      dataTable.hashes()[1]['Field Error Messages'],
    )
    cy.get(Managingrisk.noFemaleSupervisorDetailsSummError).should(
      'have.text',
      dataTable.hashes()[2]['Summary Error Messages'],
    )
    cy.get(Managingrisk.noFemaleSupervisorDetailsFieldError).should(
      'contain.text',
      dataTable.hashes()[2]['Field Error Messages'],
    )
    cy.get(Managingrisk.noMaleSupervisorDetailsSummError).should(
      'have.text',
      dataTable.hashes()[3]['Summary Error Messages'],
    )
    cy.get(Managingrisk.noMaleSupervisorDetailsFieldError).should(
      'contain.text',
      dataTable.hashes()[3]['Field Error Messages'],
    )
    cy.get(Managingrisk.restrictiveOrdersDetailsSummError).should(
      'have.text',
      dataTable.hashes()[4]['Summary Error Messages'],
    )
    cy.get(Managingrisk.restrictiveOrdersDetailsFieldError).should(
      'contain.text',
      dataTable.hashes()[4]['Field Error Messages'],
    )
    cy.get(Managingrisk.riskMgmtIssuesIndividualDetailsSummError).should(
      'have.text',
      dataTable.hashes()[5]['Summary Error Messages'],
    )
    cy.get(Managingrisk.riskMgmtIssuesIndividualDetailsFieldError).should(
      'contain.text',
      dataTable.hashes()[5]['Field Error Messages'],
    )
    cy.get(Managingrisk.riskMgmtIssuesSupervisedDetailsSummError).should(
      'have.text',
      dataTable.hashes()[6]['Summary Error Messages'],
    )
    cy.get(Managingrisk.riskMgmtIssuesSupervisedDetailsFieldError).should(
      'contain.text',
      dataTable.hashes()[6]['Field Error Messages'],
    )
    cy.get(Managingrisk.alcoholDrugIssuesDetailsSummError).should(
      'have.text',
      dataTable.hashes()[7]['Summary Error Messages'],
    )
    cy.get(Managingrisk.alcoholDrugIssuesDetailsFieldError).should(
      'contain.text',
      dataTable.hashes()[7]['Field Error Messages'],
    )
  }
})

When('I verify that the Managing risk related radio buttons are cleared', () => {
  cy.get(Managingrisk.locationExclCriteriaRBtnYes).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(Managingrisk.locationExclCriteriaRBtnNo).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(Managingrisk.restrictedPlacementRBtnYes).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(Managingrisk.restrictedPlacementRBtnNo).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(Managingrisk.noFemaleSupervisorRBtnYes).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(Managingrisk.noFemaleSupervisorRBtnNo).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(Managingrisk.noMaleSupervisorRBtnYes).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(Managingrisk.noMmaleSupervisorRBtnNo).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(Managingrisk.restrictiveOrdersRBtnYes).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(Managingrisk.restrictiveOrdersRBtnNo).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(Managingrisk.riskMgmtIssuesIndividualRBtnYes).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(Managingrisk.riskMgmtIssuesIndividualRBtnNo).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(Managingrisk.riskMgmtIssuesSupervisedRBtnYes).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(Managingrisk.riskMgmtIssuesSupervisedRBtnNo).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(Managingrisk.alcoholDrugIssuesRBtnYes).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(Managingrisk.alcoholDrugIssuesRBtnNo).should('have.attr', 'type', 'radio').should('not.be.checked')
})

When('I verify that the Managing risk related radio buttons are still selected & unselected', (dataTable) => {
  if (dataTable.hashes()[0]['Select Option'] === 'Yes') {
    cy.get(Managingrisk.locationExclCriteriaRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[0]['Select Option'] === 'No') {
    cy.get(Managingrisk.locationExclCriteriaRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[1]['Select Option'] === 'Yes') {
    cy.get(Managingrisk.restrictedPlacementRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[1]['Select Option'] === 'No') {
    cy.get(Managingrisk.restrictedPlacementRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[2]['Select Option'] === 'Yes') {
    cy.get(Managingrisk.noFemaleSupervisorRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[2]['Select Option'] === 'No') {
    cy.get(Managingrisk.noFemaleSupervisorRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[3]['Select Option'] === 'Yes') {
    cy.get(Managingrisk.noMaleSupervisorRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[3]['Select Option'] === 'No') {
    cy.get(Managingrisk.noMmaleSupervisorRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[4]['Select Option'] === 'Yes') {
    cy.get(Managingrisk.restrictiveOrdersRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[4]['Select Option'] === 'No') {
    cy.get(Managingrisk.restrictiveOrdersRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[5]['Select Option'] === 'Yes') {
    cy.get(Managingrisk.riskMgmtIssuesIndividualRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[5]['Select Option'] === 'No') {
    cy.get(Managingrisk.riskMgmtIssuesIndividualRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[6]['Select Option'] === 'Yes') {
    cy.get(Managingrisk.riskMgmtIssuesSupervisedRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[6]['Select Option'] === 'No') {
    cy.get(Managingrisk.riskMgmtIssuesSupervisedRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[7]['Select Option'] === 'Yes') {
    cy.get(Managingrisk.alcoholDrugIssuesRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[7]['Select Option'] === 'No') {
    cy.get(Managingrisk.alcoholDrugIssuesRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
})

When('I select the Options and enter the details on the "Managing Risk" page and Save', () => {
  cy.get(Common.pageHeader).should('contain.text', 'Managing risk')
  Managingrisk.selectLocationExclusionCriteriaStatus('Yes')
  Managingrisk.enterlocationExclCriteriaDetails('Entering Text related to victim exclusion criteria')
  Managingrisk.selectRestrictedPlacementStatus('Yes')
  Managingrisk.enterRestrictedPlacementDetails('Entering Text related to restricted placement')
  Managingrisk.selectNoFemaleSupervisorStatus('Yes')
  Managingrisk.enterNoFemaleSupervisorDetails(' Entering Text related to female supervisor')
  Managingrisk.selectNoMaleSupervisorStatus('No')
  Managingrisk.selectRestrictiveOrdertatus('Yes')
  Managingrisk.enterRestrictiveOrderDetails('Entering Text related to Restrictive orders')
  Managingrisk.selectRiskMgmtIssuesIndividualStatus('Yes')
  Managingrisk.enterRiskMgmtIssuesIndividualDetails(
    'Entering Text related to risk management issues for an individual placement',
  )
  Managingrisk.selectRiskMgmtIssuesSupervisedStatus('Yes')
  Managingrisk.enterRiskMgmtIssuesSupervisedDetails(
    'Entering Text related risk management issues if working in a supervised group',
  )
  Managingrisk.selectAlcoholDrugIssuesStatus('Yes')
  Managingrisk.enterAlcoholDrugIssuesDetails('Entering Text related to health and safety impact')
  Managingrisk.selectManagingRiskSectionComplete('Yes')
  IndividualsDetailsPage.clickSaveButton()
})

When('I verify the Managing risk page for cloned assessment as follows', (dataTable) => {
  if (dataTable.hashes()[0]['Option to be verified'] === 'Yes') {
    cy.get(Managingrisk.locationExclCriteriaRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
    Common.getText(Managingrisk.locationExclCriteriaDetails).should(
      'contain',
      dataTable.hashes()[0]['Text to be verified in Give Details'],
    )
  } else {
    cy.get(Managingrisk.locationExclCriteriaRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[1]['Option to be verified'] === 'Yes') {
    cy.get(Managingrisk.restrictedPlacementRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
    Common.getText(Managingrisk.restrictedPlacemenDetails).should(
      'contain',
      dataTable.hashes()[1]['Text to be verified in Give Details'],
    )
  } else {
    cy.get(Managingrisk.restrictedPlacementRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[2]['Option to be verified'] === 'Yes') {
    cy.get(Managingrisk.noFemaleSupervisorRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
    Common.getText(Managingrisk.noFemaleSupervisorDetails).should(
      'contain',
      dataTable.hashes()[2]['Text to be verified in Give Details'],
    )
  } else {
    cy.get(Managingrisk.noFemaleSupervisorRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[3]['Option to be verified'] === 'Yes') {
    cy.get(Managingrisk.noMaleSupervisorRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
    Common.getText(Managingrisk.noMaleSupervisorDetails).should(
      'contain',
      dataTable.hashes()[3]['Text to be verified in Give Details'],
    )
  } else {
    cy.get(Managingrisk.noMmaleSupervisorRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[4]['Option to be verified'] === 'Yes') {
    cy.get(Managingrisk.restrictiveOrdersRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
    Common.getText(Managingrisk.restrictiveOrderDetails).should(
      'contain',
      dataTable.hashes()[4]['Text to be verified in Give Details'],
    )
  } else {
    cy.get(Managingrisk.restrictiveOrdersRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[5]['Option to be verified'] === 'Yes') {
    cy.get(Managingrisk.riskMgmtIssuesIndividualRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
    Common.getText(Managingrisk.riskMgmtIssuesIndividualDetails).should(
      'contain',
      dataTable.hashes()[5]['Text to be verified in Give Details'],
    )
  } else {
    cy.get(Managingrisk.riskMgmtIssuesIndividualRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[6]['Option to be verified'] === 'Yes') {
    cy.get(Managingrisk.riskMgmtIssuesSupervisedRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
    Common.getText(Managingrisk.riskMgmtIssuesSupervisedDetails).should(
      'contain',
      dataTable.hashes()[6]['Text to be verified in Give Details'],
    )
  } else {
    cy.get(Managingrisk.riskMgmtIssuesSupervisedRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[7]['Option to be verified'] === 'Yes') {
    cy.get(Managingrisk.alcoholDrugIssuesRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
    Common.getText(Managingrisk.alcoholDrugIssuesDetails).should(
      'contain',
      dataTable.hashes()[7]['Text to be verified in Give Details'],
    )
  } else {
    cy.get(Managingrisk.alcoholDrugIssuesRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
})
