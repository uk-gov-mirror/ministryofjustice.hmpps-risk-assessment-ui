const { Given, Then } = require('@badeball/cypress-cucumber-preprocessor')
const ArnHomePage = require('../../integration/pages/homePage/ARNHomePage')

Given('I log in to Arn as a {string} user', (user) => {
  cy.visit('/')
  ArnHomePage.signIn(user)
})

Then('I see {string} page', (location) => {
  cy.get('#contextleft > h3, .govuk-heading-xl').should('contain', location)
})
