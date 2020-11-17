/* eslint no-unused-vars: "off" */
import './commands'

before(() => {
  cy.clearCookies()
  cy.task('reset')
  cy.task('stubAuth')
})

beforeEach(() => {
  // any functionality to happen before ever test
})

// There seem to be some uncaught exceptions in Gov UK
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})
