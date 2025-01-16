const { Given, When, Then } = require('@badeball/cypress-cucumber-preprocessor')
const placementPreferencesPage = require('../../../integration/pages/upwPages/diversity/placementPreferencesPage')
const IndividualsDetailsPage = require('../../../integration/pages/upwPages/individualsDetails/individualsDetailsPage')
const Common = require('../../../integration/pages/upwPages/common/common')

Given('I select the {string} radio Button for placement preferences', (option) => {
  placementPreferencesPage.selectPlacementPreferStatus(option)
})

When('I verify that {string} is Default state on Placement preferences page', () => {
  cy.contains('legend', 'Mark placement preferences as complete?')
    .parent()
    .within(() => {
      cy.contains('label', 'No')
        .parent()
        .within(() => {
          cy.get('input').should('be.checked')
        })
    })
})

Then('I say my placement preference is {string}', (option) => {
  placementPreferencesPage.selectPlacementPreference(option)
})

When('I select {string} for Mark this section as complete?', (option) => {
  placementPreferencesPage.selectPlacementPrefMarkSectionComplete(option)
})

Then('I see the following Placement preferences Summary and Field error messages', (dataTable) => {
  cy.get(placementPreferencesPage.placementPreferSummError).should(
    'have.text',
    dataTable.hashes()[0]['Summary Error Messages'],
  )
  cy.get(placementPreferencesPage.placementPreferFieldError).should(
    'contain.text',
    dataTable.hashes()[0]['Field Error Messages'],
  )
})

Then('I see the following Placement preferences Details Summary and Field error messages', (dataTable) => {
  cy.get(placementPreferencesPage.placementPreferCBoxSummError).should(
    'have.text',
    dataTable.hashes()[0]['Summary Error Messages'],
  )
  cy.get(placementPreferencesPage.placementPreferCBoxFieldError).should(
    'contain.text',
    dataTable.hashes()[0]['Field Error Messages'],
  )
})

When('I verify that the placement preferences related radio buttons are cleared', () => {
  cy.get(placementPreferencesPage.placementPreferRButtonYes)
    .should('have.attr', 'type', 'radio')
    .should('not.be.checked')
  cy.get(placementPreferencesPage.placementPreferRButtonNo)
    .should('have.attr', 'type', 'radio')
    .should('not.be.checked')
})

When('I verify that the placement preferences related radio button is still selected', () => {
  cy.get(placementPreferencesPage.placementPreferRButtonYes).should('have.attr', 'type', 'radio').should('be.checked')
  cy.get(placementPreferencesPage.placementPreferRButtonNo)
    .should('have.attr', 'type', 'radio')
    .should('not.be.checked')
})

When('I verify that the {string} Check Box is still selected', () => {
  cy.get(placementPreferencesPage.individualCheckBox).should('be.checked')
})

When('I say my placement preference is {string} and Save', (option) => {
  cy.get(Common.pageHeader).should('contain.text', 'Does the individual have any placement preferences?')
  placementPreferencesPage.selectPlacementPreferStatus('Yes')
  placementPreferencesPage.selectPlacementPreference(option)
  placementPreferencesPage.selectPlacementPrefMarkSectionComplete('Yes')
  IndividualsDetailsPage.clickSaveButton()
})

When('I verify the Placement preferences page for cloned assessment as follows', () => {
  cy.get(placementPreferencesPage.placementPreferRButtonYes).should('not.be.checked')
  cy.get(placementPreferencesPage.placementPreferRButtonNo).should('not.be.checked')
})
