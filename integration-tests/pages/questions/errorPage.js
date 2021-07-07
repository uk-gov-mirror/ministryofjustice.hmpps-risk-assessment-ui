const page = require('../page')

const errorPage = () =>
  page('There is a problem with the service', {
    body: () => cy.get('.govuk-body'),
  })

export default {
  verifyOnPage: errorPage,
}
