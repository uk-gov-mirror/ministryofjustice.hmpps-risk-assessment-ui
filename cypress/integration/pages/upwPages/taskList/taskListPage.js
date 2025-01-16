const sectionLink = '.task-list__item > .task-list__task-name'
const sectionTag = '.task-list__item > .govuk-tag'
const backLink = '#back-link'
const submitButton = 'button.govuk-button'
const saveAndCloseButton = '.govuk-button--secondary'

module.exports = {
  clickSubmitButton: () => {
    cy.get(submitButton).click()
  },

  clickSaveAndCloseButton: () => {
    cy.get(saveAndCloseButton).click()
  },
  sectionLink,
  sectionTag,
  backLink,
  submitButton,
  saveAndCloseButton,
}
