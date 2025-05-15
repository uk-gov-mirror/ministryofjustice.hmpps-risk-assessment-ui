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
})
Cypress.Commands.overwrite('compareSnapshot', (originalFn, ...args) => {
  return (
    cy
      // wait for content to be ready
      .get('body')
      // hide ignored elements
      .then(($app) => {
        return new Cypress.Promise((resolve) => {
          setTimeout(() => {
            // hide the CRN
            $app.find('.key-details-bar__other-details > dd:first-of-type, tr#crn > td > p').html('XXXXXX')
            $app.find('head').append(`<style>.govuk-link:visited { color: #1d70b8; }</style>`)
            resolve()
            // add a very small delay to wait for the elements to be there, but you should
            // make sure your test already handles this
          }, 300)
        })
      })
      .then(() => {
        return originalFn(...args)
      })
  )
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
