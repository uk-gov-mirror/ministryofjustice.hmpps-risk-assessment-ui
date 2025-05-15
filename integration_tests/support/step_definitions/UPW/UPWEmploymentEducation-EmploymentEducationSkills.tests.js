const { When, Then } = require('@badeball/cypress-cucumber-preprocessor')
const EmploymentEducationAndSkills = require('../../../integration/pages/upwPages/employmentEducationAndSkills/employmentEducationAndSkillsPage')

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
