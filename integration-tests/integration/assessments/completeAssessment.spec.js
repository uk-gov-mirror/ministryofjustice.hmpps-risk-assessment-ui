const AssessmentPreSentenceSummaryPage = require('../../pages/assessments/assessmentPreSentenceSummaryPage')

context('Complete Pre Sentence Assessment', () => {
  before(() => {
    cy.task('stubAssessmentApi')
  })

  it('Click and Complete a Pre Sentence Assessment', () => {
    const completeAssessPage = AssessmentPreSentenceSummaryPage.goTo()

    // check right number of forms
    completeAssessPage.completeAssessmentButton().click()
    cy.get('.govuk-panel__title').should('contain.text', 'Successful submission')
    cy.get('.govuk-panel__body').should(
      'contain.text',
      'You have completed the assessment for Garry Hart and it has been submitted',
    )
  })
})
