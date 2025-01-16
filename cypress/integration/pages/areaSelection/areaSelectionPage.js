const page = require('../page')

const areaSelectionPage = () =>
  page('List of areas', {
    startAssessmentButton: () => cy.get('.govuk-button'),
  })

module.exports = {
  verifyOnPage: areaSelectionPage,
  startAssessmentButton: () => cy.get('.govuk-button'),
}
