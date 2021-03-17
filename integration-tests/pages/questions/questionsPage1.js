const page = require('../page')
const AssessmentsPage = require('../assessments/assessmentsPage')

const questionsPage1 = () =>
  page('Page 1', {
    questions: () => cy.get('.govuk-form-group'),
    errorSummary: () => cy.get('.govuk-error-summary'),
    save: () => cy.get('button').contains('Save and continue'),
  })

export default {
  verifyOnPage: questionsPage1,
  goTo: (assessmentNumber = 0) => {
    AssessmentsPage.goTo()
      .assessments()
      .find('a')
      .eq(assessmentNumber)
      .click()
      .get('.moj-task-list__task-name')
      .click()
    return questionsPage1()
  },
}
