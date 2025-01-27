const { Given, When, Then } = require('@badeball/cypress-cucumber-preprocessor')
const querystring = require('querystring')
const ArnHomePage = require('../../../integration/pages/homePage/ARNHomePage')
const urls = require('../../../fixtures/urls.json')
const UPWStartPage = require('../../../integration/pages/upwPages/start/startPage')

Given('I login and navigate to UPW Start Page with CRN {string}', (crn) => {
  ArnHomePage.signIn(crn)
  const params = querystring.encode({
    crn,
    assessmentType: 'UPW',
    eventId: 1,
  })
  cy.visit(`${urls.startAssessment}?${params}`)
})

Then('I verify the offender does not have a PNC number', () => {
  UPWStartPage.descriptionList()
    .invoke('text')
    .then((description) => {
      expect(description).not.contains('PNC')
    })
})

When('I verify the following values on the Start Page', (dataTable) => {
  dataTable.hashes().forEach((row) => {
    const valueToBeVerified = row['Values to be verified']
    const subject = (() => {
      switch (row['Offenders Details']) {
        case 'Name':
          return UPWStartPage.offendersName()
        case 'CRN Number':
          return UPWStartPage.descriptionList()
        case 'PNC':
          return UPWStartPage.descriptionList()
        case 'Date Of Birth':
          return UPWStartPage.descriptionList()
        case 'Offence Code':
          return UPWStartPage.offence()
        case 'Subcode':
          return UPWStartPage.subCode()
        case 'Sentence Date':
          return UPWStartPage.sentenceDate()
        default:
          throw new Error(`Unexpected assertion on ${row['Offenders Details']}`)
      }
    })()

    subject.invoke('text').then((textContent) => {
      expect(textContent).contains(valueToBeVerified)
    })
  })
})

Then('I see the UPW {string} page', (pageName) => {
  cy.url().then(($url) => {
    expect($url).contains(pageName)
  })
})
