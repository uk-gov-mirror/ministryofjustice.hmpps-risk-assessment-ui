const { When, Then } = require('@badeball/cypress-cucumber-preprocessor')
const CaringCommitments = require('../../../integration/pages/upwPages/placementRestrictions/caringCommitmentsPage')

Then('I verify that the Optional Additional information text box is {string}', (textBoxState) => {
  if (textBoxState === 'Cleared') {
    cy.get(CaringCommitments.caringCommitsAddtnlDetails).should('be.visible').invoke('val').should('be.empty')
  } else if (textBoxState === 'Not cleared') {
    cy.get(CaringCommitments.caringCommitsAddtnlDetails).should('be.visible').invoke('val').should('not.be.empty')
  }
})

When('I enter Additional information as {string} for Caring commitments', (details) => {
  CaringCommitments.enterCaringCommitsAddtnlDetails(details)
})
