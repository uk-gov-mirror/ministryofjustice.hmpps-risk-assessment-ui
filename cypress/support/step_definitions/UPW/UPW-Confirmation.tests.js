const { Then } = require('@badeball/cypress-cucumber-preprocessor')
const ConfirmationPage = require('../../../integration/pages/upwPages/confirmation/confirmationPage')

Then('I download the UPW output pdf', () => {
  ConfirmationPage.clickDownloadPdfButton()
})
