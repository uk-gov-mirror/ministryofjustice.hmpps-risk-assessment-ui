const { When, Then } = require('@badeball/cypress-cucumber-preprocessor')
const GPDetailsPage = require('../../../integration/pages/upwPages/placementRestrictions/gpDetailsPage')
const EditGPDetailsPage = require('../../../integration/pages/upwPages/placementRestrictions/editGPDetailsPage')
const Common = require('../../../integration/pages/upwPages/common/common')

When('I verify that {string} is Default state on GP details page', () => {
  cy.get(GPDetailsPage.iWillComeBackLaterRBtn).should('have.attr', 'type', 'radio').should('be.checked')
})

When('I select {string} for Mark this section as complete? for GP details', (option) => {
  GPDetailsPage.selectGPDetailsSectionComplete(option)
})

When('I click {string} button for GP details', () => {
  GPDetailsPage.clickAddGPDetails()
})

When('I say Individual declined to give GP details', () => {
  GPDetailsPage.clickGPDetailsDecline()
})

Then('I see the following Summary and Field error messages on GP details page', (dataTable) => {
  cy.get(GPDetailsPage.gpDetailsDeclndSummError).should('have.text', dataTable.hashes()[0]['Summary Error Message'])
  cy.get(GPDetailsPage.gpDetailsDeclndFieldError).should('contain.text', dataTable.hashes()[0]['Field Error Message'])
})

Then('I click on {string} link against the GP Contact {string} on the GP details', (option, index) => {
  if (option === 'Remove') {
    cy.get(GPDetailsPage.gpContactRemoveLink(Number(index))).click()
  } else if (option === 'Change') {
    cy.get(GPDetailsPage.gpContactChangeLink(Number(index))).click()
  }
})

When('I see that {string} 4 sub heading is not available', () => {
  cy.get(':nth-child(8) > .govuk-heading-m').should('not.exist')
})

When('I enter the details on the "GP details" page as follows', (dataTable) => {
  EditGPDetailsPage.entergpName(dataTable.hashes()[0]['Text to be entered'])
  EditGPDetailsPage.enterMedicalPracticeName(dataTable.hashes()[1]['Text to be entered'])
  EditGPDetailsPage.enterGPAddrBldngName(dataTable.hashes()[2]['Text to be entered'])
  EditGPDetailsPage.enterGPAddrHouseNr(dataTable.hashes()[3]['Text to be entered'])
  EditGPDetailsPage.enterGPAddrStreet(dataTable.hashes()[4]['Text to be entered'])
  EditGPDetailsPage.enterGPAddrDistrict(dataTable.hashes()[5]['Text to be entered'])
  EditGPDetailsPage.enterGPAddrTownCity(dataTable.hashes()[6]['Text to be entered'])
  EditGPDetailsPage.enterGPAddrCounty(dataTable.hashes()[7]['Text to be entered'])
  EditGPDetailsPage.enterGPAddrPostCode(dataTable.hashes()[8]['Text to be entered'])
  EditGPDetailsPage.enterGPPhoneNumber(dataTable.hashes()[9]['Text to be entered'])
})

Then('I see the following Summary and Field error messages for GP details', (dataTable) => {
  cy.get(EditGPDetailsPage.gpPracticeNameSummError).should('have.text', dataTable.hashes()[0]['Summary Error Messages'])
  cy.get(EditGPDetailsPage.gpPracticeNameFieldError).should(
    'contain.text',
    dataTable.hashes()[0]['Field Error Messages'],
  )
  cy.get(EditGPDetailsPage.gpPhoneNumberSummError).should('have.text', dataTable.hashes()[1]['Summary Error Messages'])
  cy.get(EditGPDetailsPage.gpPhoneNumberFieldError).should(
    'contain.text',
    dataTable.hashes()[1]['Field Error Messages'],
  )
})

Then('I click the {string} button on GP details', () => {
  EditGPDetailsPage.clickSaveGPDetails()
})

When('I edit the "GP details" and Save', () => {
  cy.get(Common.pageHeader).should('contain.text', 'GP Details')
  GPDetailsPage.clickAddGPDetails()
  cy.get(Common.pageHeader).should('contain.text', 'Add GP details')
  EditGPDetailsPage.entergpName('Charles Doctor')
  EditGPDetailsPage.enterMedicalPracticeName('Sheffield Medical Practice')
  EditGPDetailsPage.enterGPAddrBldngName('New Offender Building ')
  EditGPDetailsPage.enterGPAddrHouseNr('1')
  EditGPDetailsPage.enterGPAddrStreet("MAIN Offender's Street")
  EditGPDetailsPage.enterGPAddrDistrict('Sheffield')
  EditGPDetailsPage.enterGPAddrTownCity('Sheffield')
  EditGPDetailsPage.enterGPAddrCounty('South Yorkshire')
  EditGPDetailsPage.enterGPAddrPostCode('S3 1HY')
  EditGPDetailsPage.enterGPPhoneNumber('02142785462')
  EditGPDetailsPage.clickSaveGPDetails()
  GPDetailsPage.selectGPDetailsSectionComplete('Yes')
  Common.clickSaveBtn()
})

When('I verify the GP contact details {string} on the GP details page as follows', (index, dataTable) => {
  dataTable.hashes().forEach((row) => {
    const subject = (() => {
      switch (row['Field Name']) {
        case 'Name':
          return GPDetailsPage.gpName(Number(index))
        case 'Practice name':
          return GPDetailsPage.gpPracticeName(Number(index))
        case 'Address':
          return GPDetailsPage.gpAddress(Number(index))
        case 'Phone number':
          return GPDetailsPage.gpPhoneNr(Number(index))
        default:
          throw Error(`Unexpected assertion for "${row['Field Name']}"`)
      }
    })()
    Common.getText(subject).should('contain', row['Text to be Verified'])
  })
})
