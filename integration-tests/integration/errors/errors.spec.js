const QuestionsPage1 = require('../../pages/questions/questionsPage1')
const errorPage = require('../../pages/questions/errorPage')

context('Error page display', () => {
  before(() => {
    cy.task('stubAssessmentApi')
  })

  it('Displays error page', () => {
    const questionsPage = QuestionsPage1.goTo()

    questionsPage
      .questions()
      .eq(1)
      .find('input')
      .type('Hart')

    questionsPage
      .questions()
      .eq(7)
      .get('[type="radio"]')
      .first()
      .check()

    questionsPage
      .questions()
      .eq(8)
      .find('textarea')
      .type('More accommodation details')

    cy.task('stubErrors')

    questionsPage.save().click()

    const thisErrorPage = errorPage.verifyOnPage()
    thisErrorPage.body().contains('We are working to fix it as quickly as possible.')
  })
})
