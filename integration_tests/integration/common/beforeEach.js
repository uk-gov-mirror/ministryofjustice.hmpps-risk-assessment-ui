beforeEach(() => {
  cy.clearLocalStorage()
  cy.clearCookies()
  cy.exec('npm cache clear --force')
})
