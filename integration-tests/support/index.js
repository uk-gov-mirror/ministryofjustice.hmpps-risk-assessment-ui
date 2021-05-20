/* eslint no-unused-vars: "off" */
import './commands'

before(() => {
  cy.task('reset')
  cy.task('stubAuth')
  cy.task('stubAssessmentApi')
})

// any functionality to happen before every test
beforeEach(() => {
  cy.clearCookies()
  cy.login()
})

// any functionality to happen after every test
afterEach(() => {
  cy.checkA11y()
  cy.lighthouse({ 'best-practices': 90 })
})
