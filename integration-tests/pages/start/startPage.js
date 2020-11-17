const page = require('../page')

const startPage = () =>
  page('Risk Assessment UI', {
    continueButton: () => cy.get('.govuk-button'),
  })

export default {
  verifyOnPage: startPage,
  goTo: () => {
    cy.visit(`/start`)
    return startPage()
  },
}
