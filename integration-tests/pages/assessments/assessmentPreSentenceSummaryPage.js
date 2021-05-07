const page = require('../page')
const {
  dev: { devAssessmentId, devPreSentenceQuestionGroupId },
} = require('../../../common/config')

const assessmentPreSentenceSummaryPage = () =>
  page('Pre-Sentence Assessment', {
    completeAssessmentButton: () => cy.get('button[name=complete-assessment]'),
  })

export default {
  verifyOnPage: assessmentPreSentenceSummaryPage,
  goTo: () => {
    cy.visit(`/${devAssessmentId}/questionGroup/${devPreSentenceQuestionGroupId}/summary`)
    return assessmentPreSentenceSummaryPage()
  },
}
