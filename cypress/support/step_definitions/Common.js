const { Then } = require('@badeball/cypress-cucumber-preprocessor')

Then('I see {string} in page title', (title) => {
  cy.title().should('equal', title)
})
