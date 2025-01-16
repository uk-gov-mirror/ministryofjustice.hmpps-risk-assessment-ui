const { When, Then } = require('@badeball/cypress-cucumber-preprocessor')
const IndividualsDetailsPage = require('../../../integration/pages/upwPages/individualsDetails/individualsDetailsPage')
const Equipment = require('../../../integration/pages/upwPages/placementDetails/equipmentPage')
const Common = require('../../../integration/pages/upwPages/common/common')

When('I verify that {string} is Default state on Equipment page', () => {
  cy.get(Equipment.iWillComeBackLaterRBtn).should('have.attr', 'type', 'radio').should('be.checked')
})

When('I select {string} for Mark this section as complete? for Equipment', (option) => {
  Equipment.selectEquipmentSectionComplete(option)
})

Then('I select the Options and enter the details on the "Equipment" page as follows', (dataTable) => {
  const questions = dataTable.hashes()
  questions.forEach((question) => {
    cy.get('form').should('contain.text', question['Question Name'])
  })
  Equipment.selectMaleFemaleClothingStatus(dataTable.hashes()[0]['Select Option'])
  Equipment.selectWaterproofClothingSize(dataTable.hashes()[1]['Select Option'])
  Equipment.selectFootwearSize(dataTable.hashes()[2]['Select Option'])
})

Then('I see the following Equipment Summary and Field error messages for {string}', (errMsgType, dataTable) => {
  cy.get(Equipment.clothingSizeSummError).should('have.text', dataTable.hashes()[0]['Summary Error Messages'])
  cy.get(Equipment.clothingSizeFieldError).should('contain.text', dataTable.hashes()[0]['Field Error Messages'])
  cy.get(Equipment.clothingSizeSummError).should('have.text', dataTable.hashes()[1]['Summary Error Messages'])
  cy.get(Equipment.clothingSizeFieldError).should('contain.text', dataTable.hashes()[1]['Field Error Messages'])
  cy.get(Equipment.footwearSizeSummError).should('have.text', dataTable.hashes()[2]['Summary Error Messages'])
  cy.get(Equipment.footwearSizeFieldError).should('contain.text', dataTable.hashes()[2]['Field Error Messages'])
})

Then('I verify that the Equipment related radio buttons are cleared', () => {
  cy.get(Equipment.clothingMaleRBtn).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(Equipment.clothingFemaleRBtn).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(Equipment.xsmallClothingRBtn).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(Equipment.smallClothingRBtn).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(Equipment.mediumClothingRBtn).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(Equipment.largeClothingRBtn).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(Equipment.xlargeClothingRBtn).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(Equipment.xxlargeClothingRBtn).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(Equipment.xxxlargeClothingRBtn).should('have.attr', 'type', 'radio').should('not.be.checked')
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

When('I select the Options and enter the details on the "Equipment" page and Save', () => {
  cy.get(Common.pageHeader).should('contain.text', 'Equipment')
  Equipment.selectMaleFemaleClothingStatus('Male')
  Equipment.selectWaterproofClothingSize('Large')
  Equipment.selectFootwearSize('Size 10')
  Equipment.selectEquipmentSectionComplete('Yes')
  IndividualsDetailsPage.clickSaveButton()
})

When('I verify the details on the "Equipment" page for cloned assessment as follows', (dataTable) => {
  if (dataTable.hashes()[0]['Select Option'] === 'Male') {
    cy.get(Equipment.clothingMaleRBtn).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[0]['Select Option'] === 'Female') {
    cy.get(Equipment.clothingFemaleRBtn).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[1]['Select Option'] === 'X-Small') {
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
  cy.get(Equipment.footwearDropdown).find('option:selected').should('have.text', dataTable.hashes()[2]['Select Option'])
})
