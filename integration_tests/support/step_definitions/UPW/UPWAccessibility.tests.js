const { When } = require('@badeball/cypress-cucumber-preprocessor')

When(/^user checks for accessibility violations$/, () => {
  cy.injectAxe()
  cy.checkA11y(null, null, null, true)
})
