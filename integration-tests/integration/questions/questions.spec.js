const QuestionsPage = require('../../pages/questions/questionsPage')
const AssessmentsPage = require('../../pages/assessments/assessmentsPage')

context('Basic questions display', () => {
  before(() => {
    cy.task('stubAssessmentApi')
  })

  it('Displays questions', () => {
    const questionsPage = QuestionsPage.goTo()

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
    const questionsPage = QuestionsPage.goTo()

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

    AssessmentsPage.verifyOnPage()
  })

  it('Show out of line conditional question', () => {
    const questionsPage = QuestionsPage.goTo()

    cy.get('#conditional-id-form-conditional-question-id-9911111').should('not.be.visible')

    // show it
    cy.get('#id-99111111-1111-1111-1111-111111111231[type="radio"]')
      .first()
      .check()

    cy.get('#conditional-id-form-conditional-question-id-9911111').should('be.visible')

    cy.pa11y({
      hideElements: 'input[aria-expanded]',
    })

    // hide it
    questionsPage
      .questions()
      .get('#id-99111111-1111-1111-1111-111111111231-2[type="radio"]')
      .first()
      .check()

    cy.get('#conditional-id-form-conditional-question-id-9911111').should('not.be.visible')
  })

  it('Post and see error summary and question error', () => {
    const questionsPage = QuestionsPage.goTo()

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

    cy.pa11y({
      hideElements: 'input[aria-expanded]',
    })

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

    questionsPage.save().click()

    // see conditional question error
    questionsPage.errorSummary().contains('Enter more detail about the accommodation')
    questionsPage
      .questions()
      .eq(8)
      .find('.govuk-error-message')
      .contains('Enter some details')

    // enter something in the conditional and get back to assessment page
    questionsPage
      .questions()
      .eq(8)
      .find('textarea')
      .type('More accommodation details')

    questionsPage.save().click()
    AssessmentsPage.verifyOnPage()
  })
})
