const { When, Then } = require('@badeball/cypress-cucumber-preprocessor')
const TravelInformation = require('../../../integration/pages/upwPages/placementRestrictions/travelPage')

Then('I see the following Travel information Summary and Field error messages', (dataTable) => {
  cy.get(TravelInformation.travelInfoSummError).should('have.text', dataTable.hashes()[0]['Summary Error Messages'])
  cy.get(TravelInformation.travelInfoFieldError).should('contain.text', dataTable.hashes()[0]['Field Error Messages'])
})

Then('I see the following Travel information Details Summary and Field error messages', (dataTable) => {
  cy.get(TravelInformation.travelInfoDetailsSummError).should(
    'have.text',
    dataTable.hashes()[0]['Summary Error Messages'],
  )
  cy.get(TravelInformation.travelInfoDetailsFieldError).should(
    'contain.text',
    dataTable.hashes()[0]['Field Error Messages'],
  )
  cy.get(TravelInformation.drivingLicenceSummError).should('have.text', dataTable.hashes()[1]['Summary Error Messages'])
  cy.get(TravelInformation.drivingLicenceFieldError).should(
    'contain.text',
    dataTable.hashes()[1]['Field Error Messages'],
  )
  cy.get(TravelInformation.vehicleSummError).should('have.text', dataTable.hashes()[2]['Summary Error Messages'])
  cy.get(TravelInformation.vehicleFieldError).should('contain.text', dataTable.hashes()[2]['Field Error Messages'])
  cy.get(TravelInformation.publicTransportSummError).should(
    'have.text',
    dataTable.hashes()[3]['Summary Error Messages'],
  )
  cy.get(TravelInformation.publicTransportFieldError).should(
    'contain.text',
    dataTable.hashes()[3]['Field Error Messages'],
  )
})

When('I verify that the Travel information related radio buttons are still selected & unselected', (dataTable) => {
  if (dataTable.hashes()[0]['Select Option'] === 'Yes') {
    cy.get(TravelInformation.travelInfoRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[0]['Select Option'] === 'No') {
    cy.get(TravelInformation.travelInfoRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[1]['Select Option'] === 'Yes') {
    cy.get(TravelInformation.drivingLicenceRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[1]['Select Option'] === 'No') {
    cy.get(TravelInformation.drivingLicenceRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[2]['Select Option'] === 'Yes') {
    cy.get(TravelInformation.vehicleRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[2]['Select Option'] === 'No') {
    cy.get(TravelInformation.vehicleRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[3]['Select Option'] === 'Yes') {
    cy.get(TravelInformation.publicTransportRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[3]['Select Option'] === 'No') {
    cy.get(TravelInformation.publicTransportRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
})
