const { When, Then } = require('@badeball/cypress-cucumber-preprocessor')
const GPDetailsPage = require('../../../integration/pages/upwPages/placementRestrictions/gpDetailsPage')
const EditGPDetailsPage = require('../../../integration/pages/upwPages/placementRestrictions/editGPDetailsPage')
const Common = require('../../../integration/pages/upwPages/common/common')

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
