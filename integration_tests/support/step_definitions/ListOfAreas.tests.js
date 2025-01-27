const { Then } = require('@badeball/cypress-cucumber-preprocessor')
const AreaSelectionPage = require('../../integration/pages/areaSelection/areaSelectionPage')

Then('I click on the Start button', () => {
  AreaSelectionPage.startAssessmentButton().click()
})
