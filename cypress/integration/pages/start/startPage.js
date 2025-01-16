const page = require('../page')

const startPage = () =>
  page('Risk Assessment UI', {
    continueButton: () => cy.get('.govuk-button'),
  })

module.exports = {
  verifyOnPage: startPage,
  goTo: () => {
    cy.visit(`/start`)
    return startPage()
  },
}
