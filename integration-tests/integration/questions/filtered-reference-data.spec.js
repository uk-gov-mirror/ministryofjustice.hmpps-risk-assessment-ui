const FilteredReferenceDataTestPage = require('../../pages/questions/filteredReferenceDataTestPage')

context('Test filtered reference data fields', () => {
  before(() => {
    cy.task('stubAssessmentApi')
  })

  it('Displays questions', () => {
    const questionsPage = FilteredReferenceDataTestPage.goTo()

    questionsPage
      .questions()
      .eq(0)
      .should('include.text', 'Assessor')

    questionsPage
      .questions()
      .eq(1)
      .should('include.text', 'Assessor Office')
  })

  it('Populates reference data fields on page load', () => {
    const questionsPage = FilteredReferenceDataTestPage.goTo()

    questionsPage
      .questions()
      .contains('div', 'Assessor Office')
      .find('option')
      .then(options => {
        const listOfOptions = [...options].map(o => o.text)
        expect(listOfOptions).to.deep.eq(['First Office', 'Second Office'])
      })
  })

  it('updates reference data fields when the target field is updated', () => {
    const questionsPage = FilteredReferenceDataTestPage.goTo()

    cy.intercept(
      'POST',
      '/e69a61ff-7395-4a12-b434-b1aa6478aded/episode/4511a3f6-7f51-4b96-b603-4e75eac0c839/referencedata/filtered',
    ).as('update')

    questionsPage
      .questions()
      .contains('div', 'Assessor')
      .find('select')
      .select('second')

    cy.wait('@update')
      .its('response.statusCode')
      .should('eq', 200)

    questionsPage
      .questions()
      .contains('div', 'Assessor Office')
      .find('option')
      .then(options => {
        const listOfOptions = [...options].map(o => o.text)
        expect(listOfOptions).to.deep.eq(['Third Office', 'Fourth Office'])
      })
  })

  it('fails gracefully when the call for reference data fails', () => {
    const questionsPage = FilteredReferenceDataTestPage.goTo()

    cy.intercept(
      'POST',
      '/e69a61ff-7395-4a12-b434-b1aa6478aded/episode/4511a3f6-7f51-4b96-b603-4e75eac0c839/referencedata/filtered',
    ).as('update')

    questionsPage
      .questions()
      .contains('div', 'Assessor')
      .find('select')
      .select('fail')

    cy.wait('@update')
      .its('response.statusCode')
      .should('eq', 500)

    questionsPage
      .questions()
      .contains('div', 'Assessor Office')
      .find('option')
      .should('not.exist')
  })
})
