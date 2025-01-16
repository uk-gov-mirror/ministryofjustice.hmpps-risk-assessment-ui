const downloadPdfButton = '.govuk-button'

module.exports = {
  clickDownloadPdfButton: () => {
    cy.get(downloadPdfButton).click()
  },
  downloadPdfButton,
}
