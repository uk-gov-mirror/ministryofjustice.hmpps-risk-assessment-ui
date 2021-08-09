const page = require('../page')

const predictorsPage = () =>
  page("Offender's scores", {
    submit: () => cy.get('.govuk-button').contains('Submit scores to OASys'),
  })

const needsPage = () => ({
  questions: () => cy.get('.govuk-form-group'),
  save: () => cy.get('button').contains('Save and continue'),
})

export default {
  verifyOnPage: predictorsPage,
  visit: () => {
    cy.visit(`/fb6b7c33-07fc-4c4c-a009-8d60f66952c4/questiongroup/RSR/0/1`)
    needsPage()
      .questions()
      .contains('Have you completed an interview with the individual?')
      .parent()
      .find('input') // Have you completed an interview with the individual? (No)
      .check('NO')
    needsPage()
      .save()
      .click()
    return predictorsPage
  },
}
