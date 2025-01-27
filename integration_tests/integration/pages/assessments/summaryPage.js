module.exports = {
  selectTaskLink: (linkName) => {
    cy.get('li').contains(linkName).click()
  },
}
