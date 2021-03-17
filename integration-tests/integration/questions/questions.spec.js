const QuestionsPage1 = require('../../pages/questions/questionsPage1')
const QuestionsPage2 = require('../../pages/questions/questionsPage2')

context('Basic questions display', () => {
  before(() => {
    cy.task('stubAssessmentApi')
  })

  it('Displays questions', () => {
    const questionsPage = QuestionsPage1.goTo()

    questionsPage
      .questions()
      .eq(0)
      .should('include.text', 'Forename')

    questionsPage
      .questions()
      .eq(1)
      .should('include.text', 'Surname')
  })

  it('Answer a couple of questions, save and see assessments list', () => {
    const questionsPage = QuestionsPage1.goTo()

    questionsPage
      .questions()
      .eq(0)
      .find('input')
      .type('Grant')

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

    questionsPage.save().click()

    QuestionsPage2.verifyOnPage()
  })

  it('Show out of line conditional question', () => {
    const questionsPage = QuestionsPage1.goTo()

    cy.get('#conditional-id-form-conditional-question-id-9911111').should('not.be.visible')

    // show it
    cy.get('#id-99111111-1111-1111-1111-111111111231[type="radio"]')
      .first()
      .check()

    cy.get('#conditional-id-form-conditional-question-id-9911111').should('be.visible')

    cy.checkA11y()

    // hide it
    questionsPage
      .questions()
      .get('#id-99111111-1111-1111-1111-111111111231-2[type="radio"]')
      .first()
      .check()

    cy.get('#conditional-id-form-conditional-question-id-9911111').should('not.be.visible')
  })

  it('Post and see error summary and question error', () => {
    const questionsPage = QuestionsPage1.goTo()

    questionsPage
      .questions()
      .eq(0)
      .find('input')
      .type('Grant')

    questionsPage.save().click()

    // see errors triggered by mandatory field validation
    questionsPage.errorSummary().contains('Select an accommodation status')

    questionsPage.errorSummary().contains('You must enter a surname')

    questionsPage
      .questions()
      .eq(1)
      .find('.govuk-error-message')
      .contains('Enter the surname')

    questionsPage
      .questions()
      .eq(7)
      .find('.govuk-error-message')
      .contains('Select an option')

    cy.checkA11y()

    questionsPage
      .questions()
      .eq(1)
      .find('input')
      .type('Hart')

    // check to see conditional question
    questionsPage
      .questions()
      .eq(7)
      .get('[type="radio"]')
      .first()
      .check()

    // questionsPage.save().click()
    //
    // // see conditional question error
    // questionsPage.errorSummary().contains('Enter more detail about the accommodation')
    // questionsPage
    //   .questions()
    //   .eq(8)
    //   .find('.govuk-error-message')
    //   .contains('Enter some details')
    //
    // // enter something in the conditional and get back to assessment page
    // questionsPage
    //   .questions()
    //   .eq(8)
    //   .find('textarea')
    //   .type('More accommodation details')

    questionsPage.save().click()
    QuestionsPage2.verifyOnPage()
    // QuestionsPage2.save().click()
    // AssessmentsPage.verifyOnPage()
  })

  it('Reveals multiple conditional questions', () => {
    const questionsPage = QuestionsPage1.goTo()

    // check to see conditional questions
    cy.get('#id-4077c218-3a16-4b92-9f98-bdd33cee476b').check()

    // check conditional questions are showing
    cy.get('#id-ef018645-b846-4022-b290-1e7d3d380b4d').should('be.visible')
    cy.get('#conditional-id-form-0419944f-ad54-4035-bef0-dca3bda4ff64').should('be.visible')
    cy.get('#conditional-id-form-db85cfb1-bf5e-4852-bfe8-137f44570cab').should('be.visible')

    questionsPage.save().click()
    // cy.get('#id-4077c218-3a16-4b92-9f98-bdd33cee476b').should('be.checked')

    // check they auto show after save and redisplay of page
    // cy.get('#id-ef018645-b846-4022-b290-1e7d3d380b4d').should('be.visible')
    // cy.get('#conditional-id-form-0419944f-ad54-4035-bef0-dca3bda4ff64').should('be.visible')
    // cy.get('#conditional-id-form-db85cfb1-bf5e-4852-bfe8-137f44570cab').should('be.visible')
  })
})
