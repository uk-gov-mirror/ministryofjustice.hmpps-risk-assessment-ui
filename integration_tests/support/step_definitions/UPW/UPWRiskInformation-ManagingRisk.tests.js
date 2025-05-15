const { When, Then } = require('@badeball/cypress-cucumber-preprocessor')
const Managingrisk = require('../../../integration/pages/upwPages/riskInformation/managingRiskPage')

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
