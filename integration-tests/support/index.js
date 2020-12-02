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
  cy.pa11y()
  cy.lighthouse({ 'best-practices': 90 })
})

// There seem to be some uncaught exceptions in Gov UK
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})
