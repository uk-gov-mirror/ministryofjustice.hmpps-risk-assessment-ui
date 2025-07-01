// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

require('./commands')
require('cypress-axe')
require('cypress-plugin-tab')

const { addCompareSnapshotCommand } = require('cypress-visual-regression/dist/command')

addCompareSnapshotCommand({
  capture: 'fullPage',
  errorThreshold: 0.1,
})
Cypress.Commands.overwrite('compareSnapshot', (originalFn, ...args) => {
  return cy
    .document()
    .then((doc) => {
      return new Cypress.Promise((resolve) => {
        setTimeout(() => {
          // hide the CRN
          doc.body
            .querySelectorAll('.key-details-bar__other-details > dd:first-of-type, tr#crn > td > p')
            .forEach((element) => {
              const updatedElement = element
              updatedElement.innerHTML = 'XXXXXX'
            })

          // override the visited state for links
          doc.body.querySelectorAll('.govuk-link').forEach((element) => {
            const updatedElement = element
            if (!updatedElement.classList.contains('govuk-link--inverse')) {
              updatedElement.classList.add('govuk-link--no-visited-state')
            }
          })

          resolve()
        }, 300)
      })
    })
    .then(() => originalFn(...args))
})

beforeEach(() => {
  cy.getCookies().then((cookies) => {
    cookies.forEach((cookie) => cy.clearCookie(cookie.name, { log: false }))
  })
})

afterEach(() => {
  cy.getCookies().then((cookies) => {
    cookies.forEach((cookie) => cy.clearCookie(cookie.name, { log: false }))
  })
})

Cypress.on('uncaught:exception', () => {
  return false
})
