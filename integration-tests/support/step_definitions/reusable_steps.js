/* global Then, When, Given */
import { baseUrl } from '../../../cypress.json'
import AssessmentsPage from '../../pages/assessments/assessmentsPage'

Then(`I see {string} in the title`, title => {
  cy.title().should('include', title)
})

Given(`I visit path {string}`, path => {
  cy.visit(`${baseUrl}${path}`)
})

Given(`I am on the start page`, () => {
  cy.visit(`${baseUrl}/start`)
})

When(`I click on the {string} button`, buttonText => {
  cy.get('button')
    .contains(`${buttonText}`)
    .click()
})

When(`I click on the {string} link`, buttonText => {
  cy.get('a')
    .contains(`${buttonText}`)
    .click()
})

When(`I see the assessments page`, () => {
  AssessmentsPage.verifyOnPage()
})

Given(`there are 3 assessments available`, () => {
  cy.get('.assessments')
    .find('h2')
    .should('have.length', 3)
})

Given(`I select assessment {int}`, assessmentNumber => {
  cy.get('.assessments')
    .find('a')
    .eq(assessmentNumber - 1)
    .click()
})

Then(`I see the "Long Form" assessment page`, () => {
  cy.get('h1').contains('Long Form')
})
