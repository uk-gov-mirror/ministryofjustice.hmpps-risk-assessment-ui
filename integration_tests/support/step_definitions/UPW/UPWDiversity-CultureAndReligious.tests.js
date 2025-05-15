const { Then } = require('@badeball/cypress-cucumber-preprocessor')
const cultureAndReligiousAdjustments = require('../../../integration/pages/upwPages/diversity/culturalAndReligiousAdjustmentsPage')

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
