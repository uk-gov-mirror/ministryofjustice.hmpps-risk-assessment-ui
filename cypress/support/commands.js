// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/**
 * Browser authentication
 */

import 'cypress-audit/commands'
import 'cypress-wait-until'

Cypress.Commands.add('login', () => {
  cy.visit('/', {
    auth: {
      username: Cypress.env('username'),
      password: Cypress.env('password'),
    },
  })
})

/**
 * Ignore uncaught exceptions
 * https://docs.cypress.io/api/events/catalog-of-events#App-Events
 */

Cypress.Commands.add('ignoreUncaughtException', () => {
  Cypress.on('uncaught:exception', () => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })
})

Cypress.Commands.add('findSummaryElementWithText', (text) => {
  cy.get(`ul.govuk-error-summary__list li:contains(${text})`)
})

Cypress.Commands.add('findPageErrorElementWithText', (text) => {
  cy.get(`p.govuk-error-message:contains(${text})`)
})
