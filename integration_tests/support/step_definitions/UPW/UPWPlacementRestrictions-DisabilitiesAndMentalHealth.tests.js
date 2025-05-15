const { Then } = require('@badeball/cypress-cucumber-preprocessor')
const DisabilitiesMentalHealth = require('../../../integration/pages/upwPages/placementRestrictions/disabilitiesAndMentalHealthPage')

Then(
  'I verify that the Disabilities and mental health related radio buttons are still selected & unselected',
  (dataTable) => {
    if (dataTable.hashes()[0]['Select Option'] === 'Yes') {
      cy.get(DisabilitiesMentalHealth.addtlDisabilitiesRBtnYes)
        .should('have.attr', 'type', 'radio')
        .should('be.checked')
      cy.get(DisabilitiesMentalHealth.disabilitiesRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
    } else if (dataTable.hashes()[0]['Select Option'] === 'No') {
      cy.get(DisabilitiesMentalHealth.disabilitiesRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
    }
  },
)
