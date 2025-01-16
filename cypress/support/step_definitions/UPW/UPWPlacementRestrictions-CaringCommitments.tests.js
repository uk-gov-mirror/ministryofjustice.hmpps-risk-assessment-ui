const { When, Then } = require('@badeball/cypress-cucumber-preprocessor')
const CaringCommitments = require('../../../integration/pages/upwPages/placementRestrictions/caringCommitmentsPage')
const IndividualsDetailsPage = require('../../../integration/pages/upwPages/individualsDetails/individualsDetailsPage')
const Common = require('../../../integration/pages/upwPages/common/common')

When('I see that {string} is Default state on Caring commitments page', () => {
  cy.get(CaringCommitments.iWillComeBackLaterRBtn).should('have.attr', 'type', 'radio').should('be.checked')
})

When('I select {string} for Mark this section as complete? for Caring commitments', (option) => {
  CaringCommitments.selectCaringCommitsSectionComplete(option)
})

Then('I verify that the Optional Additional information text box is {string}', (textBoxState) => {
  if (textBoxState === 'Cleared') {
    cy.get(CaringCommitments.caringCommitsAddtnlDetails).should('be.visible').invoke('val').should('be.empty')
  } else if (textBoxState === 'Not cleared') {
    cy.get(CaringCommitments.caringCommitsAddtnlDetails).should('be.visible').invoke('val').should('not.be.empty')
  }
})

When('I enter Additional information as {string} for Caring commitments', (details) => {
  CaringCommitments.enterCaringCommitsAddtnlDetails(details)
})

When('I enter the details on the "Caring commitments" page and Save', () => {
  cy.get(Common.pageHeader).should('contain.text', 'Are there carer commitments?')
  CaringCommitments.selectCaringCommitsSectionComplete('Yes')
  IndividualsDetailsPage.clickSaveButton()
})

When('I verify the Caring commitments page for cloned assessment as follows', (dataTable) => {
  cy.get(CaringCommitments.caringCommitmntsDelius).should('contain', dataTable.hashes()[0]['Text to be verified'])
  cy.get(CaringCommitments.caringCommitsAddtnlDetails).should('contain', dataTable.hashes()[1]['Text to be verified'])
})
