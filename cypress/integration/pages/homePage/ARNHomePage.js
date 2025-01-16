const signIn = (sessionId) => {
  cy.session(
    sessionId,
    () => {
      cy.visit('/')

      cy.get('input[id="username"]').as('username').click()
      cy.get('@username').clear()
      cy.get('@username').type('bernard.beaks')

      cy.get('input[id="password"]').as('password').click()
      cy.get('@password').clear()
      cy.get('@password').type('secret')

      cy.get('#submit').click()
    },
    {
      validate: () => {
        cy.request({ url: '/', retryOnNetworkFailure: false, failOnStatusCode: false })
          .its('status')
          .should('not.eq', 401)
      },
    },
  )
}

const getOffendersNameText = () => {
  cy.get('.key-details-bar__name')
    .invoke('text')
    .then((text) => {
      cy.wrap(text).as('offenderName')
    })
}

module.exports = { signIn, getOffendersNameText }
