const { Then } = require('@badeball/cypress-cucumber-preprocessor')

Then('I see the {string} page', (location) => {
  cy.get('h1').contains(location)
})

Then('I see the page header {string}', (location) => {
  cy.get('h1').contains(location)
})
