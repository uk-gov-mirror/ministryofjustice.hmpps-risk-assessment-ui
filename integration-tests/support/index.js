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
// note we're hiding the inputs with aria-expanded to avoid this bug in the
// govuk frontend component: https://github.com/alphagov/govuk-frontend/issues/979
// Will be able to remove once this is fixed in the templates.
afterEach(() => {
  cy.pa11y({
    hideElements: 'input[aria-expanded]',
  })
  cy.lighthouse({ 'best-practices': 90 })
})

// There seem to be some uncaught exceptions in Gov UK
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})
