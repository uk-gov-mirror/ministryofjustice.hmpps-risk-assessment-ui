/* eslint no-unused-vars: "off" */
import './commands'

before(() => {
  cy.clearCookies()
  cy.task('reset')
  cy.task('stubAssessmentApi')
  cy.task('stubAuth')
})

// any functionality to happen before every test
beforeEach(() => {})

// any functionality to happen after every test
afterEach(() => {
  cy.checkA11y()
  cy.lighthouse({ 'best-practices': 90 })
})
