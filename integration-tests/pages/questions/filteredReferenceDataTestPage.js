const page = require('../page')
const AssessmentsPage = require('../assessments/assessmentsPage')

const filteredReferenceDataPage = () =>
  page('Test filtered reference data', {
    questions: () => cy.get('.govuk-form-group'),
    errorSummary: () => cy.get('.govuk-error-summary'),
    save: () => cy.get('button').contains('Save and continue'),
  })

export default {
  verifyOnPage: filteredReferenceDataPage,
  goTo: (assessmentNumber = 0) => {
    AssessmentsPage.goTo()
      .assessments()
      .find('a')
      .eq(assessmentNumber)
      .click()
      .get('.moj-task-list__task-name')
      .contains('Assessor')
      .click()
    return filteredReferenceDataPage()
  },
}
