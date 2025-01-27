const { When, Then } = require('@badeball/cypress-cucumber-preprocessor')
const IndividualsDetailsPage = require('../../../integration/pages/upwPages/individualsDetails/individualsDetailsPage')
const IntensiveWorking = require('../../../integration/pages/upwPages/placementDetails/intensiveWorkingPage')
const Common = require('../../../integration/pages/upwPages/common/common')

When('I see that {string} is Default state on Intensive working page', () => {
  cy.get(IntensiveWorking.iWillComeBackLaterRBtn).should('have.attr', 'type', 'radio').should('be.checked')
})

When('I select {string} for Mark this section as complete? for Intensive working', (option) => {
  IntensiveWorking.selectIntesiveWorkingSectionComplete(option)
})

When('I enter the details on the "Intensive working" page as follows', (dataTable) => {
  IntensiveWorking.enterRecommendedHoursStartOrder(dataTable.hashes()[0]['Text to be entered in Details'])
  IntensiveWorking.enterRecommendedHoursMidOrder(dataTable.hashes()[1]['Text to be entered in Details'])
  IntensiveWorking.enterTwentyEightHoursWeekDetails(dataTable.hashes()[2]['Text to be entered in Details'])
})

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

When('I enter the details on the "Eligibility No Details" as follows', (dataTable) => {
  IntensiveWorking.enterEligibilityIntenseWorkNoDetails(dataTable.hashes()[0]['Text to be entered in Give Details'])
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

When('I verify that the Intensive working related radio buttons are cleared', () => {
  cy.get(IntensiveWorking.eligibilityIntenseWorkRBtnYes).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(IntensiveWorking.eligibilityIntenseWorkRBtnNo).should('have.attr', 'type', 'radio').should('not.be.checked')
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

When('I select {string} for {string} Intensive working question', (option) => {
  IntensiveWorking.selectEligibilityIntenseWorkStatus(option)
})

When('I select and enter the details on the "Intensive working" page and Save', () => {
  cy.get(Common.pageHeader).should('contain.text', 'Intensive working')
  IntensiveWorking.selectEligibilityIntenseWorkStatus('Yes')
  IntensiveWorking.enterRecommendedHoursStartOrder('21')
  IntensiveWorking.enterRecommendedHoursMidOrder('0')
  IntensiveWorking.enterTwentyEightHoursWeekDetails('Entering Text related to 28-hour working week')
  IntensiveWorking.selectIntesiveWorkingSectionComplete('Yes')
  IndividualsDetailsPage.clickSaveButton()
})

When('I verify the Intensive working page Yes option for cloned assessment as follows', (dataTable) => {
  cy.get(IntensiveWorking.eligibilityIntenseWorkRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  cy.get(IntensiveWorking.recommendedHoursStartOrderTextBox)
    .should('be.visible')
    .invoke('val')
    .should('contain', dataTable.hashes()[0]['Text to be verified'])
  cy.get(IntensiveWorking.recommendedHoursMidOrderTextBox)
    .should('be.visible')
    .invoke('val')
    .should('contain', dataTable.hashes()[1]['Text to be verified'])
  cy.get(IntensiveWorking.twentyEightHoursWeekDetails)
    .should('be.visible')
    .invoke('val')
    .should('contain', dataTable.hashes()[2]['Text to be verified'])
})
