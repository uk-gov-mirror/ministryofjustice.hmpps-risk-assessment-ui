const { When, Then } = require('@badeball/cypress-cucumber-preprocessor')
const GenderInformation = require('../../../integration/pages/upwPages/diversity/genderInformationPage')
const Common = require('../../../integration/pages/upwPages/common/common')

When('I complete {string} Section with gender as {string}', (sectionName, gender) => {
  cy.get('.task-list__task-name').contains(sectionName).click()
  cy.get(Common.pageHeader).should('contain.text', sectionName)
  GenderInformation.selectGenderIdentity(gender)
  GenderInformation.selectSexChangeStatus('Yes')
  GenderInformation.enterSexChangeDetails('Entering text related to the sex change')
  GenderInformation.selectintersexDSDStatus('Yes')
  GenderInformation.selectTransgenderStatus('Yes')
  GenderInformation.selectGenderInformationSectionComplete('Yes')
  Common.clickSaveBtn()
  cy.url().then(($url) => {
    expect($url).contains('task-list')
  })
})

When('I see that {string} link is not available', (linkName) => {
  cy.get('[class="govuk-link"]').contains(linkName).should('not.exist')
})

When('I see that {string} link is available', (linkName) => {
  cy.get('[class="govuk-link"]').contains(linkName).should('exist')
})

Then(
  'I see the following Gender information Summary and Field error messages for {string}',
  (errMsgType, dataTable) => {
    if (errMsgType === 'Questions') {
      cy.get(GenderInformation.genderIdentitySummError).should(
        'have.text',
        dataTable.hashes()[0]['Summary Error Messages'],
      )
      cy.get(GenderInformation.genderIdentityFieldError).should(
        'contain.text',
        dataTable.hashes()[0]['Field Error Messages'],
      )
      cy.get(GenderInformation.sexChangeSummError).should('have.text', dataTable.hashes()[1]['Summary Error Messages'])
      cy.get(GenderInformation.sexChangeFieldError).should(
        'contain.text',
        dataTable.hashes()[1]['Field Error Messages'],
      )
      cy.get(GenderInformation.intersexDSDSummError).should(
        'have.text',
        dataTable.hashes()[2]['Summary Error Messages'],
      )
      cy.get(GenderInformation.intersexDSDFieldError).should(
        'contain.text',
        dataTable.hashes()[2]['Field Error Messages'],
      )
      cy.get(GenderInformation.transgenderSummError).should(
        'have.text',
        dataTable.hashes()[3]['Summary Error Messages'],
      )
      cy.get(GenderInformation.transgenderFieldError).should(
        'contain.text',
        dataTable.hashes()[3]['Field Error Messages'],
      )
    }
    if (errMsgType === 'Give Details') {
      cy.get(GenderInformation.sexChangeDetailsSummError).should(
        'have.text',
        dataTable.hashes()[0]['Summary Error Messages'],
      )
      cy.get(GenderInformation.sexChangeDetailsFieldError).should(
        'contain.text',
        dataTable.hashes()[0]['Field Error Messages'],
      )
    }
  },
)

When('I verify that the Gender information related radio buttons are still selected & unselected', (dataTable) => {
  if (dataTable.hashes()[0]['Select Option'] === 'Male') {
    cy.get(GenderInformation.maleGenderRBtn).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[0]['Select Option'] === 'Female') {
    cy.get(GenderInformation.femaleGenderBtn).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[0]['Select Option'] === 'Non-binary') {
    cy.get(GenderInformation.nonBinaryGenderRBtn).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[0]['Select Option'] === 'Prefer to self-describe') {
    cy.get(GenderInformation.preferToSelfDescribeGenderRBtn).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[0]['Select Option'] === 'Prefer not to say') {
    cy.get(GenderInformation.preferNotToSayGenderRBtn).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[1]['Select Option'] === 'Yes') {
    cy.get(GenderInformation.sexChangeRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[1]['Select Option'] === 'No') {
    cy.get(GenderInformation.sexChangeRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[2]['Select Option'] === 'Yes') {
    cy.get(GenderInformation.intersexDSDRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[2]['Select Option'] === 'No') {
    cy.get(GenderInformation.intersexDSDRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[3]['Select Option'] === 'Yes') {
    cy.get(GenderInformation.transgenderRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[3]['Select Option'] === 'No') {
    cy.get(GenderInformation.transgenderRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
})
