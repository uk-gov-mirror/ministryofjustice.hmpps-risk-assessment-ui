const pageHeader =
  'h1, #main-content > h1,#main-content div:nth-child(2) > fieldset> legend, #main-content div.govuk-character-count label, .govuk-table__caption.govuk-table__caption--xl'
const saveBtn = '.questiongroup-action-buttons > .govuk-button'

module.exports = {
  clickSaveBtn: () => {
    cy.get(saveBtn).click()
  },

  getLocalCrn: (prefix = 'X') => {
    return `${prefix}${Math.floor(100000 + Math.random() * 900000)}`
  },
  getText(locator) {
    return cy.get(locator).then(($element) => {
      const txt = $element.text().trim()
      return txt // in here, return txt
    })
  },
  saveBtn,
  pageHeader,
}
