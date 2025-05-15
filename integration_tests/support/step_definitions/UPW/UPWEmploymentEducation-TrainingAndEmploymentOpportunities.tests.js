const { When, Then } = require('@badeball/cypress-cucumber-preprocessor')
const TrainingEmploymentOpps = require('../../../integration/pages/upwPages/employmentEducationAndSkills/trainingEmploymentOpportunitiesPage')

Then('I see the following Training & employment Summary and Field error messages', (dataTable) => {
  cy.get(TrainingEmploymentOpps.educationTrainingNeedSummError).should(
    'have.text',
    dataTable.hashes()[0]['Summary Error Messages'],
  )
  cy.get(TrainingEmploymentOpps.educationTrainingNeedFieldError).should(
    'contain.text',
    dataTable.hashes()[0]['Field Error Messages'],
  )
})

Then('I see the following Training & employment Details Summary and Field error messages', (dataTable) => {
  cy.get(TrainingEmploymentOpps.educTrainingNeedDetailsSummError).should(
    'have.text',
    dataTable.hashes()[0]['Summary Error Messages'],
  )
  cy.get(TrainingEmploymentOpps.educTrainingNeedDetailsFieldError).should(
    'contain.text',
    dataTable.hashes()[0]['Field Error Messages'],
  )
  cy.get(TrainingEmploymentOpps.individCommitmentSummError).should(
    'have.text',
    dataTable.hashes()[1]['Summary Error Messages'],
  )
  cy.get(TrainingEmploymentOpps.individCommitmentFieldError).should(
    'contain.text',
    dataTable.hashes()[1]['Field Error Messages'],
  )
})

Then('I see the following Training & Individual Commitment Details Summary and Field error messages', (dataTable) => {
  cy.get(TrainingEmploymentOpps.educTrainingNeedDetailsSummError).should(
    'have.text',
    dataTable.hashes()[0]['Summary Error Messages'],
  )
  cy.get(TrainingEmploymentOpps.educTrainingNeedDetailsFieldError).should(
    'contain.text',
    dataTable.hashes()[0]['Field Error Messages'],
  )
  cy.get(TrainingEmploymentOpps.individCommitmentDetailsSummError).should(
    'have.text',
    dataTable.hashes()[1]['Summary Error Messages'],
  )
  cy.get(TrainingEmploymentOpps.individCommitmentDetailsFieldError).should(
    'contain.text',
    dataTable.hashes()[1]['Field Error Messages'],
  )
})

When('I verify that the Training & employment related radio buttons are still selected & unselected', (dataTable) => {
  if (dataTable.hashes()[0]['Select Option'] === 'Yes') {
    cy.get(TrainingEmploymentOpps.educationTrainingNeedRBtnYes)
      .should('have.attr', 'type', 'radio')
      .should('be.checked')
  } else if (dataTable.hashes()[0]['Select Option'] === 'No') {
    cy.get(TrainingEmploymentOpps.educationTrainingNeedRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
})
