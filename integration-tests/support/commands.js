// eslint-disable-next-line import/no-extraneous-dependencies
import 'cypress-audit/commands'

Cypress.Commands.add('login', (url = '/') => {
  cy.request(url)
  cy.task('getLoginUrl').then(cy.visit)
})
