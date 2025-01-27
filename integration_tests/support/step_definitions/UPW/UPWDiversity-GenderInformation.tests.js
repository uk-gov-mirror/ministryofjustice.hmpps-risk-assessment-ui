const { When, Then } = require('@badeball/cypress-cucumber-preprocessor')
const IndividualsDetailsPage = require('../../../integration/pages/upwPages/individualsDetails/individualsDetailsPage')
const GenderInformation = require('../../../integration/pages/upwPages/diversity/genderInformationPage')
const Common = require('../../../integration/pages/upwPages/common/common')

When('I see that {string} is Default state on Gender information page', () => {
  cy.get(GenderInformation.iWillComeBackLaterRButtonNo).should('have.attr', 'type', 'radio').should('be.checked')
})

When('I select {string} for Mark this section as complete? for Gender information', (option) => {
  GenderInformation.selectGenderInformationSectionComplete(option)
})

When('I select the Options and enter the details on the "Gender information" page as follows', (dataTable) => {
  const questions = dataTable.hashes()
  questions.forEach((question) => {
    cy.get('form').should('contain.text', question['Question Name'])
  })
  GenderInformation.selectGenderIdentity(dataTable.hashes()[0]['Select Option'])
  GenderInformation.selectSexChangeStatus(dataTable.hashes()[1]['Select Option'])
  if (dataTable.hashes()[1]['Select Option'] === 'Yes') {
    cy.get(GenderInformation.sexChangeDetails).should('be.visible')
    GenderInformation.enterSexChangeDetails(dataTable.hashes()[1]['Text to be entered in Give Details'])
  } else {
    cy.get(GenderInformation.sexChangeDetails).should('not.be.visible')
  }
  GenderInformation.selectintersexDSDStatus(dataTable.hashes()[2]['Select Option'])
  GenderInformation.selectTransgenderStatus(dataTable.hashes()[3]['Select Option'])
})

When('I select the Gender Option as {string}', (gender) => {
  GenderInformation.selectGenderIdentity(gender)
})

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

When('I select the all the Options as Yes and select "Gender Identity" as {string}', (gender) => {
  GenderInformation.selectGenderIdentity(gender)
  GenderInformation.selectSexChangeStatus('Yes')
  GenderInformation.enterSexChangeDetails('Entering text related to the sex change')
  GenderInformation.selectintersexDSDStatus('Yes')
  GenderInformation.selectTransgenderStatus('Yes')
})

Then(
  'I select the only "Yes" Options for all the Gender information questions and do not enter the details',
  (dataTable) => {
    GenderInformation.selectGenderIdentity(dataTable.hashes()[0]['Select Option'])
    GenderInformation.selectSexChangeStatus(dataTable.hashes()[1]['Select Option'])
    GenderInformation.selectintersexDSDStatus(dataTable.hashes()[2]['Select Option'])
    GenderInformation.selectTransgenderStatus(dataTable.hashes()[3]['Select Option'])
  },
)

Then('I see that "Placement preferences" link is not available on the task list page', (dataTable) => {
  GenderInformation.selectGenderIdentity(dataTable.hashes()[0]['Select Option'])
  GenderInformation.selectSexChangeStatus(dataTable.hashes()[1]['Select Option'])
  GenderInformation.selectintersexDSDStatus(dataTable.hashes()[2]['Select Option'])
  GenderInformation.selectTransgenderStatus(dataTable.hashes()[3]['Select Option'])
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

When('I verify that the Gender information related radio buttons are cleared', () => {
  cy.get(GenderInformation.maleGenderRBtn).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(GenderInformation.femaleGenderBtn).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(GenderInformation.nonBinaryGenderRBtn).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(GenderInformation.preferToSelfDescribeGenderRBtn).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(GenderInformation.preferNotToSayGenderRBtn).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(GenderInformation.sexChangeRBtnYes).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(GenderInformation.sexChangeRBtnNo).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(GenderInformation.intersexDSDRBtnYes).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(GenderInformation.intersexDSDRBtnNo).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(GenderInformation.transgenderRBtnYes).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(GenderInformation.transgenderRBtnNo).should('have.attr', 'type', 'radio').should('not.be.checked')
})

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

When('I select the Options and enter the details on the "Gender information" page and Save', () => {
  GenderInformation.selectGenderIdentity('Female')
  GenderInformation.selectSexChangeStatus('Yes')
  GenderInformation.enterSexChangeDetails('Entering Text related to sex change')
  GenderInformation.selectintersexDSDStatus('Yes')
  GenderInformation.selectTransgenderStatus('Yes')
  GenderInformation.selectGenderInformationSectionComplete('Yes')
  IndividualsDetailsPage.clickSaveButton()
})

When('I verify the Gender information page for cloned assessment as follows', (dataTable) => {
  if (dataTable.hashes()[0]['Option to be verified'] === 'Male') {
    cy.get(GenderInformation.maleGenderRBtn).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[0]['Option to be verified'] === 'Female') {
    cy.get(GenderInformation.femaleGenderBtn).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[0]['Option to be verified'] === 'Non-binary') {
    cy.get(GenderInformation.nonBinaryGenderRBtn).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[0]['Option to be verified'] === 'Prefer to self-describe') {
    cy.get(GenderInformation.preferToSelfDescribeGenderRBtn).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[0]['Option to be verified'] === 'Prefer not to say') {
    cy.get(GenderInformation.preferNotToSayGenderRBtn).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[1]['Option to be verified'] === 'Yes') {
    cy.get(GenderInformation.sexChangeRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
    Common.getText(GenderInformation.sexChangeDetails).should(
      'contain',
      dataTable.hashes()[1]['Details to be verified'],
    )
  } else {
    expect(GenderInformation.sexChangeRBtnNo).to.be.selected()
  }
  if (dataTable.hashes()[2]['Option to be verified'] === 'Yes') {
    cy.get(GenderInformation.intersexDSDRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else {
    cy.get(GenderInformation.intersexDSDRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[3]['Option to be verified'] === 'Yes') {
    cy.get(GenderInformation.transgenderRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else {
    cy.get(GenderInformation.transgenderRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
})
