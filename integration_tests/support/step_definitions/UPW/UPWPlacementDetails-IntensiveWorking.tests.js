const { When, Then } = require('@badeball/cypress-cucumber-preprocessor')
const IntensiveWorking = require('../../../integration/pages/upwPages/placementDetails/intensiveWorkingPage')

Then('I see the following Intensive working Summary and Field error messages', (dataTable) => {
  cy.get(IntensiveWorking.eligibilityIntensWorkSummError).should(
    'have.text',
    dataTable.hashes()[0]['Summary Error Messages'],
  )
  cy.get(IntensiveWorking.eligibilityIntensWorkFieldError).should(
    'contain.text',
    dataTable.hashes()[0]['Field Error Messages'],
  )
})

Then('I see the following Intensive working Details Summary and Field error messages', (dataTable) => {
  cy.get(IntensiveWorking.recommendedHoursStartOrderSummError).should(
    'have.text',
    dataTable.hashes()[0]['Summary Error Messages'],
  )
  cy.get(IntensiveWorking.recommendedHoursStartOrderFieldError).should(
    'contain.text',
    dataTable.hashes()[0]['Field Error Messages'],
  )
  cy.get(IntensiveWorking.recommendedHoursMidOrderSummError).should(
    'have.text',
    dataTable.hashes()[1]['Summary Error Messages'],
  )
  cy.get(IntensiveWorking.recommendedHoursMidOrderFieldError).should(
    'contain.text',
    dataTable.hashes()[1]['Field Error Messages'],
  )
  cy.get(IntensiveWorking.twentyEightHoursWeekSummError).should(
    'have.text',
    dataTable.hashes()[2]['Summary Error Messages'],
  )
  cy.get(IntensiveWorking.twentyEightHoursWeekFieldError).should(
    'contain.text',
    dataTable.hashes()[2]['Field Error Messages'],
  )
})

Then('I see the following eligibility No Details Summary and Field error messages', (dataTable) => {
  cy.get(IntensiveWorking.eligibilityIntenseWorkDetailsNoSummError).should(
    'have.text',
    dataTable.hashes()[0]['Summary Error Messages'],
  )
  cy.get(IntensiveWorking.eligibilityIntenseWorkDetailsNoFieldError).should(
    'contain.text',
    dataTable.hashes()[0]['Field Error Messages'],
  )
})

When('I verify that the Intensive working related radio buttons are still selected & unselected', (dataTable) => {
  if (dataTable.hashes()[0]['Select Option'] === 'Yes') {
    cy.get(IntensiveWorking.eligibilityIntenseWorkRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
    cy.get(IntensiveWorking.recommendedHoursStartOrderTextBox).should(
      'contain.text',
      dataTable.hashes()[0]['Text to be verified in Details'],
    )
    cy.get(IntensiveWorking.recommendedHoursMidOrderTextBox).should(
      'contain.text',
      dataTable.hashes()[1]['Text to be verified in Details '],
    )
    cy.get(IntensiveWorking.twentyEightHoursWeekDetails).should(
      'contain.text',
      dataTable.hashes()[2]['Text to be verified in Details'],
    )
  } else if (dataTable.hashes()[0]['Select Option'] === 'No') {
    cy.get(IntensiveWorking.eligibilityIntenseWorkRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
})
