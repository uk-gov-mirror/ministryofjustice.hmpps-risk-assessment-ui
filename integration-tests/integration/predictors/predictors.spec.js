const PredictorsPage = require('../../pages/predictors/predictorsPage')

// const scoreHistoryTimeline = () => cy.get('#predictor-scores-history').find('.predictor-timeline-section')

const headingsIn = elementId => cy.get(`#${elementId}`).find('h2')

context('Predictors page', () => {
  before(() => {
    cy.task('stubAssessmentApi')
  })

  it('Shows predictor scores', () => {
    PredictorsPage.visit()

    headingsIn('predictor-scores')
      .should('contain.text', 'RSR score')
      .should('contain.text', 'OSP/C score')
      .should('contain.text', 'OSP/I score')
  })

  // 👇 uncomment these when we add history

  // it('Allows the user to "Open all" timeline events', () => {
  //   PredictorsPage.visit()

  //   headingsIn('predictor-scores-history').should('contain.text', 'Scores history')

  //   scoreHistoryTimeline().should('not.to.be.visible')

  //   cy.contains('a', 'Open all').click()

  //   scoreHistoryTimeline().should('to.be.visible')

  //   scoreHistoryTimeline().contains('RSR HIGH')
  //   scoreHistoryTimeline().contains('OSP/C MEDIUM')
  //   scoreHistoryTimeline().contains('OSP/I LOW')
  // })

  // it('Allows the user to "Open" a single timeline event', () => {
  //   PredictorsPage.visit()

  //   scoreHistoryTimeline()
  //     .first()
  //     .should('not.to.be.visible')

  //   scoreHistoryTimeline()
  //     .first()
  //     .parent()
  //     .contains('a', 'Open')
  //     .click()

  //   scoreHistoryTimeline()
  //     .first()
  //     .should('to.be.visible')
  // })
})
