const { When, Then } = require('@badeball/cypress-cucumber-preprocessor')
const HealthIssues = require('../../../integration/pages/upwPages/placementRestrictions/healthIssuesPage')

Then('I see the following Health issues Summary and Field error messages for {string}', (errMsgType, dataTable) => {
  if (errMsgType === 'Questions') {
    cy.get(HealthIssues.allergiesSummError).should('have.text', dataTable.hashes()[0]['Summary Error Messages'])
    cy.get(HealthIssues.allergiesFieldError).should('contain.text', dataTable.hashes()[0]['Field Error Messages'])
    cy.get(HealthIssues.lossOfConsciousnessSummError).should(
      'have.text',
      dataTable.hashes()[1]['Summary Error Messages'],
    )
    cy.get(HealthIssues.lossOfConsciousnessFieldError).should(
      'contain.text',
      dataTable.hashes()[1]['Field Error Messages'],
    )
    cy.get(HealthIssues.epilepsySummError).should('have.text', dataTable.hashes()[2]['Summary Error Messages'])
    cy.get(HealthIssues.epilepsyFieldError).should('contain.text', dataTable.hashes()[2]['Field Error Messages'])
    cy.get(HealthIssues.otherHealthIssuesSummError).should('have.text', dataTable.hashes()[3]['Summary Error Messages'])
    cy.get(HealthIssues.otherHealthIssuesFieldError).should(
      'contain.text',
      dataTable.hashes()[3]['Field Error Messages'],
    )
  }
  if (errMsgType === 'Give Details') {
    cy.get(HealthIssues.allergiesDetailsSummError).should('have.text', dataTable.hashes()[0]['Summary Error Messages'])
    cy.get(HealthIssues.allergiesDetailsFieldError).should(
      'contain.text',
      dataTable.hashes()[0]['Field Error Messages'],
    )
    cy.get(HealthIssues.lossOfConsciousnessDetailsSummError).should(
      'have.text',
      dataTable.hashes()[1]['Summary Error Messages'],
    )
    cy.get(HealthIssues.lossOfConsciousnessDetailsFieldError).should(
      'contain.text',
      dataTable.hashes()[1]['Field Error Messages'],
    )
    cy.get(HealthIssues.epilepsyDetailsSummError).should('have.text', dataTable.hashes()[2]['Summary Error Messages'])
    cy.get(HealthIssues.epilepsyDetailsFieldError).should('contain.text', dataTable.hashes()[2]['Field Error Messages'])
    cy.get(HealthIssues.pregnancyDetailsSummError).should('have.text', dataTable.hashes()[3]['Summary Error Messages'])
    cy.get(HealthIssues.pregnancyDetailsFieldError).should(
      'contain.text',
      dataTable.hashes()[3]['Field Error Messages'],
    )
    cy.get(HealthIssues.otherHealthIssuesDetailsSummError).should(
      'have.text',
      dataTable.hashes()[4]['Summary Error Messages'],
    )
    cy.get(HealthIssues.otherHealthIssuesDetailsFieldError).should(
      'contain.text',
      dataTable.hashes()[4]['Field Error Messages'],
    )
  }
})

When('I verify that the Health issues related radio buttons are still selected & unselected', (dataTable) => {
  if (dataTable.hashes()[0]['Select Option'] === 'Yes') {
    cy.get(HealthIssues.allergiesRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[0]['Select Option'] === 'No') {
    cy.get(HealthIssues.allergiesRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[1]['Select Option'] === 'Yes') {
    cy.get(HealthIssues.lossOfConsciousnessRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[1]['Select Option'] === 'No') {
    cy.get(HealthIssues.lossOfConsciousnessRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[2]['Select Option'] === 'Yes') {
    cy.get(HealthIssues.epilepsyRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[2]['Select Option'] === 'No') {
    cy.get(HealthIssues.epilepsyRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[3]['Select Option'] === 'Pregnant') {
    cy.get(HealthIssues.pregnancyRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[3]['Select Option'] === 'Recently given birth') {
    cy.get(HealthIssues.recentlyGivenBirthBtn).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[3]['Select Option'] === 'No') {
    cy.get(HealthIssues.pregnancyRecentBirthRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[4]['Select Option'] === 'Yes') {
    cy.get(HealthIssues.otherHealthIssuesRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[4]['Select Option'] === 'No') {
    cy.get(HealthIssues.otherHealthIssuesRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
})
