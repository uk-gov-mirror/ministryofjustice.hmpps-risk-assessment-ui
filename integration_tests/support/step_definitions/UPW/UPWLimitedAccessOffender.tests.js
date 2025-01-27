const { Then } = require('@badeball/cypress-cucumber-preprocessor')

Then('I am presented with the subheading {string}', (errorMessage) => {
  cy.contains('h2', errorMessage)
})
