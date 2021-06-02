const AssessmentPage = require('../../pages/assessments/assessmentsPage')
const AreaSelectionPage = require('../../pages/areaSelection/areaSelectionPage')

context('Area Selection page display all regions', () => {
  before(() => {
    cy.task('reset')
    cy.clearCookies()
    cy.task('stubAuth')
    cy.task('stubAssessmentApi')
    cy.task('stubGetUserProfileWithMultipleAreas')
    Cypress.Cookies.preserveOnce()
    cy.login()
  })

  it('Displays area selection page with multiple regions', () => {
    const page = AreaSelectionPage.goTo()
    AreaSelectionPage.verifyOnPage()
    AreaSelectionPage.selectRegion('La', 'Lancashire')
    AreaSelectionPage.selectRegion('La', 'Lancashire 2 (HMP)')
    page.startAssessmentButton().click()
    AssessmentPage.verifyOnPage()
  })
})
