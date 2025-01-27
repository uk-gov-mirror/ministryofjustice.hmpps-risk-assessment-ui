const { When, Then } = require('@badeball/cypress-cucumber-preprocessor')

const IndividualsDetailsPage = require('../../../integration/pages/upwPages/individualsDetails/individualsDetailsPage')
const EmploymentEducationAndSkills = require('../../../integration/pages/upwPages/employmentEducationAndSkills/employmentEducationAndSkillsPage')
const Common = require('../../../integration/pages/upwPages/common/common')

When('I verify that {string} is Default state on Employment, education and skills page', () => {
  cy.get(EmploymentEducationAndSkills.iWillComeBackLaterRBtn).should('have.attr', 'type', 'radio').should('be.checked')
})

When('I select {string} for Mark this section as complete? for Employment, education and skills', (option) => {
  EmploymentEducationAndSkills.selectEmplEducationSkillsSectionComplete(option)
})

When(
  'I select the Options and enter the details on the "Employment, education and skills" page as follows',
  (dataTable) => {
    const questions = dataTable.hashes()
    questions.forEach((question) => {
      cy.get('form').should('contain.text', question['Question Name'])
    })
    EmploymentEducationAndSkills.selectEmplEducationStatus(dataTable.hashes()[0]['Select Option'])
    if (dataTable.hashes()[0]['Select Option'] === 'Full-time education or employment') {
      cy.get(EmploymentEducationAndSkills.fullTimeEmplEducationDetails).should('be.visible')
      EmploymentEducationAndSkills.enterFullTimeEmplEducationDetails(
        dataTable.hashes()[0]['Text to be entered in Give Details'],
      )
    } else if (dataTable.hashes()[0]['Select Option'] === 'Part-time education or employment') {
      cy.get(EmploymentEducationAndSkills.partTimeEmplEducationDetails).should('be.visible')
      EmploymentEducationAndSkills.enterPartTimeEmplEducationDetails(
        dataTable.hashes()[0]['Text to be entered in Give Details'],
      )
    } else {
      cy.get(EmploymentEducationAndSkills.fullTimeEmplEducationDetails).should('not.be.visible')
      cy.get(EmploymentEducationAndSkills.partTimeEmplEducationDetails).should('not.be.visible')
    }
    EmploymentEducationAndSkills.selectReadWriteDifficultiesStatus(dataTable.hashes()[1]['Select Option'])
    if (dataTable.hashes()[1]['Select Option'] === 'Yes') {
      cy.get(EmploymentEducationAndSkills.readWriteDifficultiesDetails).should('be.visible')
      EmploymentEducationAndSkills.enterReadWriteDifficultiesDetails(
        dataTable.hashes()[1]['Text to be entered in Give Details'],
      )
    } else {
      cy.get(EmploymentEducationAndSkills.readWriteDifficultiesDetails).should('not.be.visible')
    }
    EmploymentEducationAndSkills.selectWorkSkillsStatus(dataTable.hashes()[2]['Select Option'])
    if (dataTable.hashes()[2]['Select Option'] === 'Yes') {
      cy.get(EmploymentEducationAndSkills.workSkillsDetails).should('be.visible')
      EmploymentEducationAndSkills.enterWorkSkillsDetails(dataTable.hashes()[2]['Text to be entered in Give Details'])
    } else {
      cy.get(EmploymentEducationAndSkills.workSkillsDetails).should('not.be.visible')
    }
    EmploymentEducationAndSkills.selectFutureWorkPlansStatus(dataTable.hashes()[3]['Select Option'])
    if (dataTable.hashes()[3]['Select Option'] === 'Yes') {
      cy.get(EmploymentEducationAndSkills.futureWorkPlansDetails).should('be.visible')
      EmploymentEducationAndSkills.enterFutureWorkPlansDetails(
        dataTable.hashes()[3]['Text to be entered in Give Details'],
      )
    } else {
      cy.get(EmploymentEducationAndSkills.futureWorkPlansDetails).should('not.be.visible')
    }
  },
)

Then(
  'I select the only "Yes" Options for all the Employment, education and skills questions and do not enter the details',
  (dataTable) => {
    EmploymentEducationAndSkills.selectEmplEducationStatus(dataTable.hashes()[0]['Select Option'])
    EmploymentEducationAndSkills.selectReadWriteDifficultiesStatus(dataTable.hashes()[1]['Select Option'])
    EmploymentEducationAndSkills.selectWorkSkillsStatus(dataTable.hashes()[2]['Select Option'])
    EmploymentEducationAndSkills.selectFutureWorkPlansStatus(dataTable.hashes()[3]['Select Option'])
  },
)

Then(
  'I see the following Employment, education and skills Summary and Field error messages for {string}',
  (errMsgType, dataTable) => {
    if (errMsgType === 'Questions') {
      cy.get(EmploymentEducationAndSkills.emplEducationSummError).should(
        'have.text',
        dataTable.hashes()[0]['Summary Error Messages'],
      )
      cy.get(EmploymentEducationAndSkills.emplEducationFieldError).should(
        'contain.text',
        dataTable.hashes()[0]['Field Error Messages'],
      )
      cy.get(EmploymentEducationAndSkills.readWriteDifficultiesSummError).should(
        'have.text',
        dataTable.hashes()[1]['Summary Error Messages'],
      )
      cy.get(EmploymentEducationAndSkills.readWriteDifficultiesFieldError).should(
        'contain.text',
        dataTable.hashes()[1]['Field Error Messages'],
      )
      cy.get(EmploymentEducationAndSkills.workSkillsSummError).should(
        'have.text',
        dataTable.hashes()[2]['Summary Error Messages'],
      )
      cy.get(EmploymentEducationAndSkills.workSkillsFieldError).should(
        'contain.text',
        dataTable.hashes()[2]['Field Error Messages'],
      )
      cy.get(EmploymentEducationAndSkills.futureWorkPlansSummError).should(
        'have.text',
        dataTable.hashes()[3]['Summary Error Messages'],
      )
      cy.get(EmploymentEducationAndSkills.futureWorkPlansFieldError).should(
        'contain.text',
        dataTable.hashes()[3]['Field Error Messages'],
      )
    }
    if (errMsgType === 'Give Details') {
      cy.get(EmploymentEducationAndSkills.fullTimeEmplEducationDetailsSummError).should(
        'have.text',
        dataTable.hashes()[0]['Summary Error Messages'],
      )
      cy.get(EmploymentEducationAndSkills.fullTimeEmplEducationDetailsFieldError).should(
        'contain.text',
        dataTable.hashes()[0]['Field Error Messages'],
      )
      cy.get(EmploymentEducationAndSkills.readWriteDifficultDetailsSummError).should(
        'have.text',
        dataTable.hashes()[1]['Summary Error Messages'],
      )
      cy.get(EmploymentEducationAndSkills.readWriteDifficultDetailsFieldError).should(
        'contain.text',
        dataTable.hashes()[1]['Field Error Messages'],
      )
      cy.get(EmploymentEducationAndSkills.workSkillsDetailsSummError).should(
        'have.text',
        dataTable.hashes()[2]['Summary Error Messages'],
      )
      cy.get(EmploymentEducationAndSkills.workSkillsDetailsFieldError).should(
        'contain.text',
        dataTable.hashes()[2]['Field Error Messages'],
      )
      cy.get(EmploymentEducationAndSkills.futureWorkPlansDetailsSummError).should(
        'have.text',
        dataTable.hashes()[3]['Summary Error Messages'],
      )
      cy.get(EmploymentEducationAndSkills.futureWorkPlansDetailsFieldError).should(
        'contain.text',
        dataTable.hashes()[3]['Field Error Messages'],
      )
    }
  },
)

When('I verify that the Employment, education and skills related radio buttons are cleared', () => {
  cy.get(EmploymentEducationAndSkills.fullTimeEmplEducationRBtn)
    .should('have.attr', 'type', 'radio')
    .should('not.be.checked')
  cy.get(EmploymentEducationAndSkills.partTimeEmplEducationRBtn)
    .should('have.attr', 'type', 'radio')
    .should('not.be.checked')
  cy.get(EmploymentEducationAndSkills.noEmplEducationRBtn).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(EmploymentEducationAndSkills.readWriteDifficultiesRBtnYes)
    .should('have.attr', 'type', 'radio')
    .should('not.be.checked')
  cy.get(EmploymentEducationAndSkills.readWriteDifficultiesRBtnNo)
    .should('have.attr', 'type', 'radio')
    .should('not.be.checked')
  cy.get(EmploymentEducationAndSkills.workSkillsRBtnYes).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(EmploymentEducationAndSkills.workSkillsRBtnNo).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(EmploymentEducationAndSkills.futureWorkPlansRBtnYes)
    .should('have.attr', 'type', 'radio')
    .should('not.be.checked')
  cy.get(EmploymentEducationAndSkills.futureWorkPlansRBtnNo)
    .should('have.attr', 'type', 'radio')
    .should('not.be.checked')
})

When(
  'I verify that the Employment, education related related radio buttons are still selected & unselected',
  (dataTable) => {
    if (dataTable.hashes()[0]['Select Option'] === 'Full-time education or employment') {
      cy.get(EmploymentEducationAndSkills.fullTimeEmplEducationRBtn)
        .should('have.attr', 'type', 'radio')
        .should('be.checked')
    } else if (dataTable.hashes()[0]['Select Option'] === 'Part-time education or employment') {
      cy.get(EmploymentEducationAndSkills.partTimeEmplEducationRBtn)
        .should('have.attr', 'type', 'radio')
        .should('be.checked')
    } else if (dataTable.hashes()[0]['Select Option'] === 'No') {
      cy.get(EmploymentEducationAndSkills.noEmplEducationRBtn).should('have.attr', 'type', 'radio').should('be.checked')
    }
    if (dataTable.hashes()[1]['Select Option'] === 'Yes') {
      cy.get(EmploymentEducationAndSkills.readWriteDifficultiesRBtnYes)
        .should('have.attr', 'type', 'radio')
        .should('be.checked')
    } else if (dataTable.hashes()[1]['Select Option'] === 'No') {
      cy.get(EmploymentEducationAndSkills.readWriteDifficultiesRBtnNo)
        .should('have.attr', 'type', 'radio')
        .should('be.checked')
    }
    if (dataTable.hashes()[2]['Select Option'] === 'Yes') {
      cy.get(EmploymentEducationAndSkills.workSkillsRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
    } else if (dataTable.hashes()[2]['Select Option'] === 'No') {
      cy.get(EmploymentEducationAndSkills.workSkillsRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
    }
    if (dataTable.hashes()[3]['Select Option'] === 'Yes') {
      cy.get(EmploymentEducationAndSkills.futureWorkPlansRBtnYes)
        .should('have.attr', 'type', 'radio')
        .should('be.checked')
    } else if (dataTable.hashes()[3]['Select Option'] === 'No') {
      cy.get(EmploymentEducationAndSkills.futureWorkPlansRBtnNo)
        .should('have.attr', 'type', 'radio')
        .should('be.checked')
    }
  },
)

When('I select the Options and enter the details on the "Employment, education and skills" page and Save', () => {
  cy.get(Common.pageHeader).should('contain.text', 'Employment, education and skills')
  EmploymentEducationAndSkills.selectEmplEducationStatus('Full-time education or employment')
  EmploymentEducationAndSkills.enterFullTimeEmplEducationDetails('Entering Text related to Full-time education')
  EmploymentEducationAndSkills.selectReadWriteDifficultiesStatus('Yes')
  EmploymentEducationAndSkills.enterReadWriteDifficultiesDetails('Entering Text related to writing difficulties')
  EmploymentEducationAndSkills.selectWorkSkillsStatus('Yes')
  EmploymentEducationAndSkills.enterWorkSkillsDetails('Entering Text related to work skills')
  EmploymentEducationAndSkills.selectFutureWorkPlansStatus('Yes')
  EmploymentEducationAndSkills.enterFutureWorkPlansDetails('Entering Text related to future work plans')
  EmploymentEducationAndSkills.selectEmplEducationSkillsSectionComplete('Yes')
  IndividualsDetailsPage.clickSaveButton()
})

When('I verify the Employment, education and skills page for cloned assessment as follows', (dataTable) => {
  if (dataTable.hashes()[0]['Option to be verified'] === 'Full-time education or employment') {
    cy.get(EmploymentEducationAndSkills.fullTimeEmplEducationRBtn)
      .should('have.attr', 'type', 'radio')
      .should('be.checked')
    Common.getText(EmploymentEducationAndSkills.fullTimeEmplEducationDetails).should(
      'contain',
      dataTable.hashes()[0]['Text to be verified in Give Details'],
    )
  } else if (dataTable.hashes()[0]['Option to be verified'] === 'Part-time education or employment') {
    cy.get(EmploymentEducationAndSkills.partTimeEmplEducationRBtn)
      .should('have.attr', 'type', 'radio')
      .should('be.checked')
    Common.getText(EmploymentEducationAndSkills.partTimeEmplEducationDetails).should(
      'contain',
      dataTable.hashes()[0]['Text to be verified in Give Details'],
    )
  } else if (dataTable.hashes()[0]['Option to be verified'] === 'No') {
    cy.get(EmploymentEducationAndSkills.noEmplEducationRBtn).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[1]['Option to be verified'] === 'Yes') {
    cy.get(EmploymentEducationAndSkills.readWriteDifficultiesRBtnYes)
      .should('have.attr', 'type', 'radio')
      .should('be.checked')
    Common.getText(EmploymentEducationAndSkills.readWriteDifficultiesDetails).should(
      'contain',
      dataTable.hashes()[1]['Text to be verified in Give Details'],
    )
  } else {
    cy.get(EmploymentEducationAndSkills.readWriteDifficultiesRBtnNo)
      .should('have.attr', 'type', 'radio')
      .should('be.checked')
  }
  if (dataTable.hashes()[2]['Option to be verified'] === 'Yes') {
    cy.get(EmploymentEducationAndSkills.workSkillsRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
    Common.getText(EmploymentEducationAndSkills.workSkillsDetails).should(
      'contain',
      dataTable.hashes()[2]['Text to be verified in Give Details'],
    )
  } else {
    cy.get(EmploymentEducationAndSkills.workSkillsRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[3]['Option to be verified'] === 'Yes') {
    cy.get(EmploymentEducationAndSkills.futureWorkPlansRBtnYes)
      .should('have.attr', 'type', 'radio')
      .should('be.checked')
    Common.getText(EmploymentEducationAndSkills.futureWorkPlansDetails).should(
      'contain',
      dataTable.hashes()[3]['Text to be verified in Give Details'],
    )
  } else {
    cy.get(EmploymentEducationAndSkills.futureWorkPlansRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
})
