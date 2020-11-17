const page = require('../page')

const assessmentsPage = () =>
  page('Available assessments', {
    assessments: () => cy.get('.assessments'),
  })

export default {
  verifyOnPage: assessmentsPage,
  goTo: () => {
    cy.visit(`/assessments`)
    return assessmentsPage()
  },
}
