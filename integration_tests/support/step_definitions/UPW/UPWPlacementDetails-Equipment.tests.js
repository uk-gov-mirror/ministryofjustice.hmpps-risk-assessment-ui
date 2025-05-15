const { Then } = require('@badeball/cypress-cucumber-preprocessor')
const Equipment = require('../../../integration/pages/upwPages/placementDetails/equipmentPage')

Then('I see the following Equipment Summary and Field error messages for {string}', (errMsgType, dataTable) => {
  cy.get(Equipment.clothingSizeSummError).should('have.text', dataTable.hashes()[0]['Summary Error Messages'])
  cy.get(Equipment.clothingSizeFieldError).should('contain.text', dataTable.hashes()[0]['Field Error Messages'])
  cy.get(Equipment.clothingSizeSummError).should('have.text', dataTable.hashes()[1]['Summary Error Messages'])
  cy.get(Equipment.clothingSizeFieldError).should('contain.text', dataTable.hashes()[1]['Field Error Messages'])
  cy.get(Equipment.footwearSizeSummError).should('have.text', dataTable.hashes()[2]['Summary Error Messages'])
  cy.get(Equipment.footwearSizeFieldError).should('contain.text', dataTable.hashes()[2]['Field Error Messages'])
})

Then('I verify that the Equipment related radio buttons are still selected & unselected', (dataTable) => {
  if (dataTable.hashes()[0]['Select Option'] === 'Male') {
    cy.get(Equipment.clothingMaleRBtn).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[0]['Select Option'] === 'Female') {
    cy.get(Equipment.clothingFemaleRBtn).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[1]['Select Option'] === 'Male') {
    cy.get(Equipment.xsmallClothingRBtn).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[1]['Select Option'] === 'Small') {
    cy.get(Equipment.smallClothingRBtn).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[1]['Select Option'] === 'Medium') {
    cy.get(Equipment.mediumClothingRBtn).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[1]['Select Option'] === 'Large') {
    cy.get(Equipment.largeClothingRBtn).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[1]['Select Option'] === 'X-Large') {
    cy.get(Equipment.xlargeClothingRBtn).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[1]['Select Option'] === 'XX-Large') {
    cy.get(Equipment.xxlargeClothingRBtn).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[1]['Select Option'] === 'XXX-Large') {
    cy.get(Equipment.xxxlargeClothingRBtn).should('have.attr', 'type', 'radio').should('be.checked')
  }
})
