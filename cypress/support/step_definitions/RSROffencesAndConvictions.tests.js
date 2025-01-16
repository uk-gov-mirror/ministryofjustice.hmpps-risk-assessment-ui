const { Then } = require('@badeball/cypress-cucumber-preprocessor')
const NeedsPage = require('../../integration/pages/needs/needsPage')

Then('I click on back link', () => {
  NeedsPage.backLink()
})
