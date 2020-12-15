const page = require('../page')
const {
  dev: { devAssessmentId },
} = require('../../../common/config')

const assessmentsPage = () =>
  page('Available assessments', {
    assessments: () => cy.get('.assessments'),
  })

export default {
  verifyOnPage: assessmentsPage,
  goTo: () => {
    cy.visit(`/${devAssessmentId}/assessments`)
    return assessmentsPage()
  },
}
