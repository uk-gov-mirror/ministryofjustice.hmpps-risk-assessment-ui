const { Then } = require('@badeball/cypress-cucumber-preprocessor')
const Common = require('../../../integration/pages/upwPages/common/common')

Then('I click on the {string} button', () => {
  Common.clickSaveBtn()
})
