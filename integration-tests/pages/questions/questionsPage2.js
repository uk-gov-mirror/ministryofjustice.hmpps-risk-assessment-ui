const page = require('../page')

const questionsPage2 = () =>
  page('Page 2', {
    save: () => cy.get('button').contains('Save and continue'),
  })

export default {
  verifyOnPage: questionsPage2,
}
