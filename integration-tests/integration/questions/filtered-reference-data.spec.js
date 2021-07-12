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
      .should('include.text', 'Assessor Office')

    questionsPage
      .questions()
      .eq(1)
      .should('include.text', 'Assessor Team')
  })

  it('Populates reference data fields on page load', () => {
    cy.intercept(
      'POST',
      '/fb6b7c33-07fc-4c4c-a009-8d60f66952c4/episode/4511a3f6-7f51-4b96-b603-4e75eac0c839/referencedata/filtered',
    ).as('update')

    const questionsPage = FilteredReferenceDataTestPage.goTo()

    cy.wait('@update')
      .its('response.statusCode')
      .should('eq', 200)

    questionsPage
      .questions()
      .contains('div', 'Assessor Team')
      .find('.govuk-label')
      .then(options => {
        const listOfOptions = [...options].map(o => o.textContent.trim())
        expect(listOfOptions).to.deep.eq(['First Team', 'Second Team'])
      })
  })

  it('updates reference data fields when the target field is updated', () => {
    const questionsPage = FilteredReferenceDataTestPage.goTo()

    questionsPage
      .questions()
      .contains('div', 'Assessor Team')
      .find('.govuk-label')
      .then(options => {
        const listOfOptions = [...options].map(o => o.textContent.trim())
        expect(listOfOptions).to.deep.eq(['First Team', 'Second Team'])
      })

    cy.intercept(
      'POST',
      '/fb6b7c33-07fc-4c4c-a009-8d60f66952c4/episode/4511a3f6-7f51-4b96-b603-4e75eac0c839/referencedata/filtered',
    ).as('update')

    questionsPage
      .questions()
      .contains('div', 'Assessor Office')
      .find('[type="radio"]')
      .check('second')

    cy.wait('@update')
      .its('response.statusCode')
      .should('eq', 200)

    questionsPage
      .questions()
      .contains('div', 'Assessor Team')
      .find('.govuk-label')
      .then(options => {
        const listOfOptions = [...options].map(o => o.textContent.trim())
        expect(listOfOptions).to.deep.eq(['Third Team', 'Fourth Team'])
      })
  })

  it('fails gracefully when the call for reference data fails', () => {
    const questionsPage = FilteredReferenceDataTestPage.goTo()

    cy.intercept(
      'POST',
      '/fb6b7c33-07fc-4c4c-a009-8d60f66952c4/episode/4511a3f6-7f51-4b96-b603-4e75eac0c839/referencedata/filtered',
    ).as('update')

    questionsPage
      .questions()
      .contains('div', 'Assessor Office')
      .find('[type="radio"]')
      .check('fail')

    cy.wait('@update')
      .its('response.statusCode')
      .should('eq', 500)

    questionsPage
      .questions()
      .contains('div', 'Assessor Team')
      .find('.govuk-label')
      .should('not.exist')
  })
})
