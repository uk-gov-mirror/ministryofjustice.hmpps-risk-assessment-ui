const StartPage = require('../../pages/start/startPage')

context('Start page display', () => {
  before(() => {
    cy.task('stubAssessmentApi')
  })

  it('Displays start page', () => {
    cy.visit('/start')
    cy.url().should('include', 'start')
    StartPage.verifyOnPage()
    cy.get('h1').should('contain.text', 'Risk Assessment UI')
  })

  it('Displays the user name', () => {
    cy.visit('/start')
    cy.get('.moj-header__navigation-item').should('contain.text', 'Test x-auth-name')
  })

  it('Root (/) redirects to the start page', () => {
    cy.visit('/')
    cy.url().should('include', 'start')
    cy.get('h1').should('contain.text', 'Risk Assessment UI')
  })
})
