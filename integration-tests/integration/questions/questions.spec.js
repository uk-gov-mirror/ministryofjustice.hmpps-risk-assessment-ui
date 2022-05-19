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

    cy.get('#conditional-id-form-accommodation_type').should('not.be.visible')

    // show it
    cy.get('#test_conditional_out_of_line[type="radio"]')
      .first()
      .check()

    cy.get('#conditional-id-form-accommodation_type').should('be.visible')

    cy.checkA11y()

    // hide it
    questionsPage
      .questions()
      .get('#test_conditional_out_of_line-2[type="radio"]')
      .first()
      .check()

    cy.get('#conditional-id-form-accommodation_type').should('not.be.visible')
  })

  it('Reveals multiple conditional questions', () => {
    const questionsPage = QuestionsPage1.goTo()

    // check to see conditional questions
    cy.get('#drug_misuse_behaviour').check()

    // check conditional questions are showing
    cy.get('#drug_misuse_details').should('be.visible')
    cy.get('#drug_misuse_details').should('be.visible')
    cy.get('#drug_misuse_details').should('be.visible')

    questionsPage.save().click()
  })
})
