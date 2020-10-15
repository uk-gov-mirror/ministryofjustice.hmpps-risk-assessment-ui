const page = require('../page')

const startPage = () =>
  page('Risk Assessment UI', {
    continueButton: () => cy.get('button'),
  })

export default {
  verifyOnPage: startPage,
  goTo: () => {
    cy.visit(`/start`)
    return startPage()
  },
}
