const page = require('../page')
const AssessmentsPage = require('../assessments/assessmentsPage')

const questionsPage = () =>
  page('Brief Form', {
    questions: () => cy.get('.govuk-form-group'),
    save: () => cy.get('button').contains('Save'),
  })

export default {
  verifyOnPage: questionsPage,
  goTo: (assessmentNumber = 0) => {
    AssessmentsPage.goTo()
      .assessments()
      .find('a')
      .eq(assessmentNumber)
      .click()
    return questionsPage()
  },
}
