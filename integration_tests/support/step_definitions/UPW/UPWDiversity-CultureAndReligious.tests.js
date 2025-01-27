const { When, Then } = require('@badeball/cypress-cucumber-preprocessor')
const IndividualsDetailsPage = require('../../../integration/pages/upwPages/individualsDetails/individualsDetailsPage')
const cultureAndReligiousAdjustments = require('../../../integration/pages/upwPages/diversity/culturalAndReligiousAdjustmentsPage')
const Common = require('../../../integration/pages/upwPages/common/common')

When('I verify that {string} is Default state on Cultural and religious page', () => {
  cy.contains('legend', 'Mark cultural or religious adjustments section as complete?')
    .parent()
    .within(() => {
      cy.contains('label', 'No')
        .parent()
        .within(() => {
          cy.get('input').should('be.checked')
        })
    })
})

When('I select the {string} radio Button for culture and religious adjustments', (option) => {
  cultureAndReligiousAdjustments.selectCulturalReligiousAdjstStatus(option)
})

When('I enter details for culture and religious adjustments as {string}', (details) => {
  cultureAndReligiousAdjustments.enterCulturalAndReligiousDetails(details)
})

Then('I see the following Cultural or religious Summary and Field error messages', (dataTable) => {
  cy.get(cultureAndReligiousAdjustments.cultReligiousAdjstSummError).should(
    'have.text',
    dataTable.hashes()[0]['Summary Error Messages'],
  )
  cy.get(cultureAndReligiousAdjustments.cultReligiousAdjstFieldError).should(
    'contain.text',
    dataTable.hashes()[0]['Field Error Messages'],
  )
})

Then('I see the following Cultural or religious Details Summary and Field error messages', (dataTable) => {
  cy.get(cultureAndReligiousAdjustments.cultReligiousAdjstDetailsSummError).should(
    'have.text',
    dataTable.hashes()[0]['Summary Error Messages'],
  )
  cy.get(cultureAndReligiousAdjustments.cultReligiousAdjstDetailsFieldError).should(
    'contain.text',
    dataTable.hashes()[0]['Field Error Messages'],
  )
})

When('I select {string} for Mark this section as complete? for Culture And Religious Adjustments', (option) => {
  cultureAndReligiousAdjustments.selectCulturalReligiousMarkSectionComplete(option)
})

When('I verify that the culture and religious related radio buttons are cleared', () => {
  cy.get(cultureAndReligiousAdjustments.cultReligiousAdjstRBtnYes)
    .should('have.attr', 'type', 'radio')
    .should('not.be.checked')
  cy.get(cultureAndReligiousAdjustments.cultReligiousAdjstRBtnNo)
    .should('have.attr', 'type', 'radio')
    .should('not.be.checked')
})

When('I verify that the Culture and religious related radio button is still selected', () => {
  cy.get(cultureAndReligiousAdjustments.cultReligiousAdjstRBtnYes)
    .should('have.attr', 'type', 'radio')
    .should('be.checked')
  cy.get(cultureAndReligiousAdjustments.cultReligiousAdjstRBtnNo)
    .should('have.attr', 'type', 'radio')
    .should('not.be.checked')
})

When('I verify that the Culture and religious related text box still have the text {string}', () => {
  cy.get(cultureAndReligiousAdjustments.cultReligiousAdjstRBtnYes)
    .should('have.attr', 'type', 'radio')
    .should('be.checked')
  cy.get(cultureAndReligiousAdjustments.cultReligiousAdjstRBtnNo)
    .should('have.attr', 'type', 'radio')
    .should('not.be.checked')
})

When('I select the option and enter details for culture and religious adjustments and Save', () => {
  cy.get(Common.pageHeader).should('contain.text', 'Are adjustments required for cultural or religious reasons?')
  cultureAndReligiousAdjustments.selectCulturalReligiousAdjstStatus('Yes')
  cultureAndReligiousAdjustments.enterCulturalAndReligiousDetails('Test Culture details')
  cultureAndReligiousAdjustments.selectCulturalReligiousMarkSectionComplete('Yes')
  IndividualsDetailsPage.clickSaveButton()
})

When('I verify the Cultural or religious page for cloned assessment as follows', (dataTable) => {
  if (dataTable.hashes()[0]['Option to be verified'] === 'Yes') {
    cy.get(cultureAndReligiousAdjustments.cultReligiousAdjstRBtnYes)
      .should('have.attr', 'type', 'radio')
      .should('be.checked')
    Common.getText(cultureAndReligiousAdjustments.cultReligiousAdjstDetails).should(
      'contain',
      dataTable.hashes()[0]['Details to be verified'],
    )
  } else {
    cy.get(cultureAndReligiousAdjustments.cultReligiousAdjstRBtnNo)
      .should('have.attr', 'type', 'radio')
      .should('be.checked')
  }
})
