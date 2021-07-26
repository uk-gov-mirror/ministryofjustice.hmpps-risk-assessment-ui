const AssessmentsPage = require('../../pages/assessments/assessmentsPage')

context('Basic assessment list', () => {
  before(() => {
    cy.task('stubAssessmentApi')
  })

  it('Displays the available assessments', () => {
    const assessPage = AssessmentsPage.goTo()

    // check right number of forms
    const forms = ['Brief Form', 'Long Form', 'Overview', 'Short pre sentence assessment', 'Standalone PSR']
    assessPage
      .assessments()
      .find('h2')
      .should('have.length', 5)
      .each(($el, index) => {
        expect($el.text()).to.equal(forms[index])
      })
  })
})
