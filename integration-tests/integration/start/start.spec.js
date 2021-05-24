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
    cy.url().should('include', 'start')
    StartPage.verifyOnPage()
    cy.get('.moj-header__navigation-item').should('contain.text', 'TEST_USER')
  })

  it('Has a link to logout', () => {
    cy.visit('/start')
    cy.url().should('include', 'start')
    StartPage.verifyOnPage()
    cy.get('.govuk-header__link').should('contain.text', 'Sign out')
  })

  it('Root (/) redirects to the start page', () => {
    cy.visit('/')
    cy.url().should('include', 'start')
    StartPage.verifyOnPage()
    cy.get('h1').should('contain.text', 'Risk Assessment UI')
  })
})
