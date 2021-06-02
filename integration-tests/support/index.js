/* eslint no-unused-vars: "off" */
import './commands'

before(() => {
  cy.task('reset')
  cy.clearCookies()
  cy.task('stubAuth')
  cy.task('stubAssessmentApi')
  cy.task('stubGetUserProfileWithSingleArea')
  Cypress.Cookies.preserveOnce()
  cy.login()
})

// any functionality to happen before every test
beforeEach(() => {})

// any functionality to happen after every test
afterEach(() => {
  cy.checkA11y()
  cy.lighthouse({ 'best-practices': 90 })
})
