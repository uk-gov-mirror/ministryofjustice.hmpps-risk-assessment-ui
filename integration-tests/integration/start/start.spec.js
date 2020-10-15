const StartPage = require('../../pages/start/startPage')

context('Login functionality', () => {
  before(() => {
    cy.clearCookies()
  })

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubQuestionResponses')
  })

  it('Displays start page', () => {
    cy.visit('/start')
    cy.url().should('include', 'start')
    StartPage.verifyOnPage()
    cy.get('h1').should('contain.text', 'Risk Assessment UI')
  })

  it('Root (/) redirects to the start page', () => {
    cy.visit('/')
    cy.url().should('include', 'start')
    cy.get('h1').should('contain.text', 'Risk Assessment UI')
  })
})
