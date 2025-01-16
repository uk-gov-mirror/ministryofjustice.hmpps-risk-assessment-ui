const { When } = require('@badeball/cypress-cucumber-preprocessor')
const SummaryPage = require('../../integration/pages/assessments/summaryPage')

When('I click on {string} link', (linkName) => {
  SummaryPage.selectTaskLink(linkName)
})
