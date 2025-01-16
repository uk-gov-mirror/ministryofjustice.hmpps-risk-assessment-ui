const { When, Then } = require('@badeball/cypress-cucumber-preprocessor')
const RiskOfHarmCommunityPage = require('../../../integration/pages/upwPages/riskInformation/riskOfHarmCommunityPage')
const IndividualsDetailsPage = require('../../../integration/pages/upwPages/individualsDetails/individualsDetailsPage')
const Common = require('../../../integration/pages/upwPages/common/common')

When('I verify that {string} is Default state on Risk of harm in the community page', () => {
  cy.get(RiskOfHarmCommunityPage.iWillComeBackLaterRBtn).should('have.attr', 'type', 'radio').should('be.checked')
})

When('I verify the following questions are available on the {string} page', (pageName, dataTable) => {
  const questions = dataTable.hashes()
  questions.forEach((question) => {
    cy.get('form').should('contain.text', question['Question Name'])
  })
})

When('I select {string} for Mark this section as complete? for Risk of harm in the community', (option) => {
  RiskOfHarmCommunityPage.selectRiskOfHarmMarkSectionComplete(option)
})

When(
  'I select the Options and enter the details on the "Risk of harm in the community" page as follows',
  (dataTable) => {
    const questions = dataTable.hashes()
    questions.forEach((question) => {
      cy.get('form').should('contain.text', question['Question Name'])
    })
    RiskOfHarmCommunityPage.selectHistoryOfSexOffendingStatus(dataTable.hashes()[0]['Select Option'])
    if (dataTable.hashes()[0]['Select Option'] === 'Yes') {
      cy.get(RiskOfHarmCommunityPage.historyOfSexOffendingDetails).should('be.visible')
      RiskOfHarmCommunityPage.enterHistoryOfSexOffendingDetails(
        dataTable.hashes()[0]['Text to be entered in Give Details'],
      )
    } else {
      cy.get(RiskOfHarmCommunityPage.historyOfSexOffendingDetails).should('not.be.visible')
    }
    RiskOfHarmCommunityPage.selectRiskToChildrenStatus(dataTable.hashes()[1]['Select Option'])
    if (dataTable.hashes()[1]['Select Option'] === 'Yes') {
      cy.get(RiskOfHarmCommunityPage.riskToChildrenDetails).should('be.visible')
      RiskOfHarmCommunityPage.enterRiskToChildrenDetails(dataTable.hashes()[1]['Text to be entered in Give Details'])
    } else {
      cy.get(RiskOfHarmCommunityPage.riskToChildrenDetails).should('not.be.visible')
    }
    RiskOfHarmCommunityPage.selectViolentOffencesStatus(dataTable.hashes()[2]['Select Option'])
    if (dataTable.hashes()[2]['Select Option'] === 'Yes') {
      cy.get(RiskOfHarmCommunityPage.violentOffencesDetails).should('be.visible')
      RiskOfHarmCommunityPage.enterViolentOffencesDetails(dataTable.hashes()[2]['Text to be entered in Give Details'])
    } else {
      cy.get(RiskOfHarmCommunityPage.violentOffencesDetails).should('not.be.visible')
    }
    RiskOfHarmCommunityPage.selectAcquisitiveOffendingStatus(dataTable.hashes()[3]['Select Option'])
    if (dataTable.hashes()[3]['Select Option'] === 'Yes') {
      cy.get(RiskOfHarmCommunityPage.acquisitiveOffendingDetails).should('be.visible')
      RiskOfHarmCommunityPage.enterAcquisitiveOffendingDetails(
        dataTable.hashes()[3]['Text to be entered in Give Details'],
      )
    } else {
      cy.get(RiskOfHarmCommunityPage.acquisitiveOffendingDetails).should('not.be.visible')
    }
    RiskOfHarmCommunityPage.selectSeriousGroupOffendingStatus(dataTable.hashes()[4]['Select Option'])
    if (dataTable.hashes()[4]['Select Option'] === 'Yes') {
      cy.get(RiskOfHarmCommunityPage.seriousGroupOffendingDetails).should('be.visible')
      RiskOfHarmCommunityPage.enterSeriousGroupOffendingDetails(
        dataTable.hashes()[4]['Text to be entered in Give Details'],
      )
    } else {
      cy.get(RiskOfHarmCommunityPage.seriousGroupOffendingDetails).should('not.be.visible')
    }
    RiskOfHarmCommunityPage.selectControlIssuesStatus(dataTable.hashes()[5]['Select Option'])
    if (dataTable.hashes()[5]['Select Option'] === 'Yes') {
      cy.get(RiskOfHarmCommunityPage.controlIssuesDetails).should('be.visible')
      RiskOfHarmCommunityPage.enterControlIssuesDetails(dataTable.hashes()[5]['Text to be entered in Give Details'])
    } else {
      cy.get(RiskOfHarmCommunityPage.controlIssuesDetails).should('not.be.visible')
    }
    RiskOfHarmCommunityPage.selectHateBehaviourStatus(dataTable.hashes()[6]['Select Option'])
    if (dataTable.hashes()[6]['Select Option'] === 'Yes') {
      cy.get(RiskOfHarmCommunityPage.hateBehaviourDetails).should('be.visible')
      RiskOfHarmCommunityPage.enterHateBehaviourDetails(dataTable.hashes()[6]['Text to be entered in Give Details'])
    } else {
      cy.get(RiskOfHarmCommunityPage.hateBehaviourDetails).should('not.be.visible')
    }
    RiskOfHarmCommunityPage.selectHighProfilePersonStatus(dataTable.hashes()[7]['Select Option'])
    if (dataTable.hashes()[7]['Select Option'] === 'Yes') {
      cy.get(RiskOfHarmCommunityPage.highProfilePersonDetails).should('be.visible')
      RiskOfHarmCommunityPage.enterHighProfilePersonDetails(dataTable.hashes()[7]['Text to be entered in Give Details'])
    } else {
      cy.get(RiskOfHarmCommunityPage.highProfilePersonDetails).should('not.be.visible')
    }
    RiskOfHarmCommunityPage.selectAdditionalRiskAssesInfoStatus(dataTable.hashes()[8]['Select Option'])
    if (dataTable.hashes()[8]['Select Option'] === 'Yes') {
      cy.get(RiskOfHarmCommunityPage.additionalRoshInfoDetails).should('exist')
      RiskOfHarmCommunityPage.enterAdditionalRiskAssesInfoDetails(
        dataTable.hashes()[8]['Text to be entered in Give Details'],
      )
    } else {
      cy.get(RiskOfHarmCommunityPage.additionalRoshInfoDetails).should('not.be.visible')
    }
  },
)

When('I select {string} for Mark this section as complete? for Risk of Harm Community', (option) => {
  RiskOfHarmCommunityPage.selectRiskOfHarmMarkSectionComplete(option)
})

Then('I select the only "Yes" Options for all the Risk of harm questions and do not enter the details', (dataTable) => {
  RiskOfHarmCommunityPage.selectHistoryOfSexOffendingStatus(dataTable.hashes()[0]['Select Option'])
  RiskOfHarmCommunityPage.selectRiskToChildrenStatus(dataTable.hashes()[1]['Select Option'])
  RiskOfHarmCommunityPage.selectViolentOffencesStatus(dataTable.hashes()[2]['Select Option'])
  RiskOfHarmCommunityPage.selectAcquisitiveOffendingStatus(dataTable.hashes()[3]['Select Option'])
  RiskOfHarmCommunityPage.selectSeriousGroupOffendingStatus(dataTable.hashes()[4]['Select Option'])
  RiskOfHarmCommunityPage.selectControlIssuesStatus(dataTable.hashes()[5]['Select Option'])
  RiskOfHarmCommunityPage.selectHateBehaviourStatus(dataTable.hashes()[6]['Select Option'])
  RiskOfHarmCommunityPage.selectHighProfilePersonStatus(dataTable.hashes()[7]['Select Option'])
  RiskOfHarmCommunityPage.selectAdditionalRiskAssesInfoStatus(dataTable.hashes()[8]['Select Option'])
})

Then('I see the following Summary and Field error messages for {string}', (errMsgType, dataTable) => {
  if (errMsgType === 'Questions') {
    cy.get(RiskOfHarmCommunityPage.historyOfSexOffendingSummError).should(
      'have.text',
      dataTable.hashes()[0]['Summary Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.historyOfSexOffendingFieldError).should(
      'contain.text',
      dataTable.hashes()[0]['Field Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.riskToChildrenSummError).should(
      'have.text',
      dataTable.hashes()[1]['Summary Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.riskToChildrenFieldError).should(
      'contain.text',
      dataTable.hashes()[1]['Field Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.violentOffencesSummError).should(
      'have.text',
      dataTable.hashes()[2]['Summary Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.violentOffencesFieldError).should(
      'contain.text',
      dataTable.hashes()[2]['Field Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.acquisitiveOffendingSummError).should(
      'have.text',
      dataTable.hashes()[3]['Summary Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.acquisitiveOffendingFieldError).should(
      'contain.text',
      dataTable.hashes()[3]['Field Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.seriousGroupOffendingSummError).should(
      'have.text',
      dataTable.hashes()[4]['Summary Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.seriousGroupOffendingFieldError).should(
      'contain.text',
      dataTable.hashes()[4]['Field Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.controlIssuesSummError).should(
      'have.text',
      dataTable.hashes()[5]['Summary Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.controlIssuesFieldError).should(
      'contain.text',
      dataTable.hashes()[5]['Field Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.hateBehaviourSummError).should(
      'have.text',
      dataTable.hashes()[6]['Summary Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.hateBehaviourFieldError).should(
      'contain.text',
      dataTable.hashes()[6]['Field Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.highProfilePersonSummError).should(
      'have.text',
      dataTable.hashes()[7]['Summary Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.highProfilePersonFieldError).should(
      'contain.text',
      dataTable.hashes()[7]['Field Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.additionalRoshInfoSummError).should(
      'have.text',
      dataTable.hashes()[8]['Summary Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.additionalRoshInfoFieldError).should(
      'contain.text',
      dataTable.hashes()[8]['Field Error Messages'],
    )
  }
  if (errMsgType === 'Give Details') {
    cy.get(RiskOfHarmCommunityPage.historyOfSexOffendingDetailsSummError).should(
      'have.text',
      dataTable.hashes()[0]['Summary Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.historyOfSexOffendingDetailsFieldError).should(
      'contain.text',
      dataTable.hashes()[0]['Field Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.riskToChildrenDetailsSummError).should(
      'have.text',
      dataTable.hashes()[1]['Summary Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.riskToChildrenDetailsFieldError).should(
      'contain.text',
      dataTable.hashes()[1]['Field Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.violentOffencesDetailsSummError).should(
      'have.text',
      dataTable.hashes()[2]['Summary Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.violentOffencesDetailsFieldError).should(
      'contain.text',
      dataTable.hashes()[2]['Field Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.acquisitiveOffendingDetailsSummError).should(
      'have.text',
      dataTable.hashes()[3]['Summary Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.acquisitiveOffendingDetailsFieldError).should(
      'contain.text',
      dataTable.hashes()[3]['Field Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.seriousGroupOffendingDetailsSummError).should(
      'have.text',
      dataTable.hashes()[4]['Summary Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.seriousGroupOffendingDetailsFieldError).should(
      'contain.text',
      dataTable.hashes()[4]['Field Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.controlIssuesDetailsSummError).should(
      'have.text',
      dataTable.hashes()[5]['Summary Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.controlIssuesDetailsFieldError).should(
      'contain.text',
      dataTable.hashes()[5]['Field Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.hateBehaviourDetailsSummError).should(
      'have.text',
      dataTable.hashes()[6]['Summary Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.hateBehaviourDetailsFieldError).should(
      'contain.text',
      dataTable.hashes()[6]['Field Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.highProfilePersonDetailsSummError).should(
      'have.text',
      dataTable.hashes()[7]['Summary Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.highProfilePersonDetailsFieldError).should(
      'contain.text',
      dataTable.hashes()[7]['Field Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.additionalRoshInfoDetailsSummError).should(
      'have.text',
      dataTable.hashes()[8]['Summary Error Messages'],
    )
    cy.get(RiskOfHarmCommunityPage.additionalRoshInfoDetailsFieldError).should(
      'contain.text',
      dataTable.hashes()[8]['Field Error Messages'],
    )
  }
})

When('I verify that the Risk of harm related radio buttons are cleared', () => {
  cy.get(RiskOfHarmCommunityPage.historyOfSexOffendingRBtnYes)
    .should('have.attr', 'type', 'radio')
    .should('not.be.checked')
  cy.get(RiskOfHarmCommunityPage.historyOfSexOffendingRBtnNo)
    .should('have.attr', 'type', 'radio')
    .should('not.be.checked')
  cy.get(RiskOfHarmCommunityPage.riskToChildrenRBtnYes).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(RiskOfHarmCommunityPage.riskToChildrenRBtnNo).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(RiskOfHarmCommunityPage.violentOffencesRBtnYes).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(RiskOfHarmCommunityPage.violentOffencesRBtnNo).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(RiskOfHarmCommunityPage.acquisitiveOffendingRBtnYes)
    .should('have.attr', 'type', 'radio')
    .should('not.be.checked')
  cy.get(RiskOfHarmCommunityPage.acquisitiveOffendingRBtnNo)
    .should('have.attr', 'type', 'radio')
    .should('not.be.checked')
  cy.get(RiskOfHarmCommunityPage.seriousGroupOffendingRBtnYes)
    .should('have.attr', 'type', 'radio')
    .should('not.be.checked')
  cy.get(RiskOfHarmCommunityPage.seriousGroupOffendingRBtnNo)
    .should('have.attr', 'type', 'radio')
    .should('not.be.checked')
  cy.get(RiskOfHarmCommunityPage.controlIssuesRBtnYes).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(RiskOfHarmCommunityPage.controlIssuesRBtnNo).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(RiskOfHarmCommunityPage.hateBehaviourRBtnYes).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(RiskOfHarmCommunityPage.hateBehaviourRBtnNo).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(RiskOfHarmCommunityPage.highProfilePersonRBtnYes).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(RiskOfHarmCommunityPage.highProfilePersonRBtnNo).should('have.attr', 'type', 'radio').should('not.be.checked')
  cy.get(RiskOfHarmCommunityPage.additionalRoshInfoRBtnYes)
    .should('have.attr', 'type', 'radio')
    .should('not.be.checked')
  cy.get(RiskOfHarmCommunityPage.additionalRoshInfoRBtnNo).should('have.attr', 'type', 'radio').should('not.be.checked')
})

When('I verify that the Risk of harm related related radio buttons are still selected & unselected', (dataTable) => {
  if (dataTable.hashes()[0]['Select Option'] === 'Yes') {
    cy.get(RiskOfHarmCommunityPage.historyOfSexOffendingRBtnYes)
      .should('have.attr', 'type', 'radio')
      .should('be.checked')
  } else if (dataTable.hashes()[0]['Select Option'] === 'No') {
    cy.get(RiskOfHarmCommunityPage.historyOfSexOffendingRBtnNo)
      .should('have.attr', 'type', 'radio')
      .should('be.checked')
  }
  if (dataTable.hashes()[1]['Select Option'] === 'Yes') {
    cy.get(RiskOfHarmCommunityPage.riskToChildrenRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[1]['Select Option'] === 'No') {
    cy.get(RiskOfHarmCommunityPage.riskToChildrenRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[2]['Select Option'] === 'Yes') {
    cy.get(RiskOfHarmCommunityPage.violentOffencesRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[2]['Select Option'] === 'No') {
    cy.get(RiskOfHarmCommunityPage.violentOffencesRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[3]['Select Option'] === 'Yes') {
    cy.get(RiskOfHarmCommunityPage.acquisitiveOffendingRBtnYes)
      .should('have.attr', 'type', 'radio')
      .should('be.checked')
  } else if (dataTable.hashes()[3]['Select Option'] === 'No') {
    cy.get(RiskOfHarmCommunityPage.acquisitiveOffendingRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[4]['Select Option'] === 'Yes') {
    cy.get(RiskOfHarmCommunityPage.seriousGroupOffendingRBtnYes)
      .should('have.attr', 'type', 'radio')
      .should('be.checked')
  } else if (dataTable.hashes()[4]['Select Option'] === 'No') {
    cy.get(RiskOfHarmCommunityPage.seriousGroupOffendingRBtnNo)
      .should('have.attr', 'type', 'radio')
      .should('be.checked')
  }
  if (dataTable.hashes()[5]['Select Option'] === 'Yes') {
    cy.get(RiskOfHarmCommunityPage.controlIssuesRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[5]['Select Option'] === 'No') {
    cy.get(RiskOfHarmCommunityPage.controlIssuesRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[6]['Select Option'] === 'Yes') {
    cy.get(RiskOfHarmCommunityPage.hateBehaviourRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[6]['Select Option'] === 'No') {
    cy.get(RiskOfHarmCommunityPage.hateBehaviourRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[7]['Select Option'] === 'Yes') {
    cy.get(RiskOfHarmCommunityPage.highProfilePersonRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[7]['Select Option'] === 'No') {
    cy.get(RiskOfHarmCommunityPage.highProfilePersonRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
  if (dataTable.hashes()[8]['Select Option'] === 'Yes') {
    cy.get(RiskOfHarmCommunityPage.additionalRoshInfoRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
  } else if (dataTable.hashes()[8]['Select Option'] === 'No') {
    cy.get(RiskOfHarmCommunityPage.additionalRoshInfoRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
})

When('I select the Options and enter the details on the "Risk of harm in the community" page and Save', () => {
  cy.get(Common.pageHeader).should('contain.text', 'Risk of harm in the community')
  RiskOfHarmCommunityPage.clearExistingValuesInAllDetailsTextBoxes()
  RiskOfHarmCommunityPage.selectHistoryOfSexOffendingStatus('Yes')
  RiskOfHarmCommunityPage.enterHistoryOfSexOffendingDetails('Entering Text related to sexual offending')
  RiskOfHarmCommunityPage.selectRiskToChildrenStatus('Yes')
  RiskOfHarmCommunityPage.enterRiskToChildrenDetails('Entering Text related to risk to children')
  RiskOfHarmCommunityPage.selectViolentOffencesStatus('Yes')
  RiskOfHarmCommunityPage.enterViolentOffencesDetails('Entering Text related to Violent offences')
  RiskOfHarmCommunityPage.selectAcquisitiveOffendingStatus('Yes')
  RiskOfHarmCommunityPage.enterAcquisitiveOffendingDetails('Entering Text related to acquisitive offending')
  RiskOfHarmCommunityPage.selectSeriousGroupOffendingStatus('Yes')
  RiskOfHarmCommunityPage.enterSeriousGroupOffendingDetails('Entering Text related to serious group offending')
  RiskOfHarmCommunityPage.selectControlIssuesStatus('Yes')
  RiskOfHarmCommunityPage.enterControlIssuesDetails('Entering Text related to disruptive behaviour')
  RiskOfHarmCommunityPage.selectHateBehaviourStatus('Yes')
  RiskOfHarmCommunityPage.enterHateBehaviourDetails('Entering Text related to hate-based attitudes')
  RiskOfHarmCommunityPage.selectHighProfilePersonStatus('Yes')
  RiskOfHarmCommunityPage.enterHighProfilePersonDetails('Entering Text related to high-profile person')
  RiskOfHarmCommunityPage.selectAdditionalRiskAssesInfoStatus('Yes')
  RiskOfHarmCommunityPage.enterAdditionalRiskAssesInfoDetails('Entering Text related to Additional information')
  RiskOfHarmCommunityPage.selectRiskOfHarmMarkSectionComplete('Yes')
  IndividualsDetailsPage.clickSaveButton()
})

When('I verify the Risk of harm in the community page for cloned assessment as follows', (dataTable) => {
  if (dataTable.hashes()[0]['Option to be verified'] === 'Yes') {
    cy.get(RiskOfHarmCommunityPage.historyOfSexOffendingRBtnYes)
      .should('have.attr', 'type', 'radio')
      .should('be.checked')
    Common.getText(RiskOfHarmCommunityPage.historyOfSexOffendingDetails).should(
      'contain',
      dataTable.hashes()[0]['Text to be verified in Give Details'],
    )
  } else {
    cy.get(RiskOfHarmCommunityPage.historyOfSexOffendingRBtnNo)
      .should('have.attr', 'type', 'radio')
      .should('be.checked')
  }

  if (dataTable.hashes()[1]['Option to be verified'] === 'Yes') {
    cy.get(RiskOfHarmCommunityPage.riskToChildrenRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
    Common.getText(RiskOfHarmCommunityPage.riskToChildrenDetails).should(
      'contain',
      dataTable.hashes()[1]['Text to be verified in Give Details'],
    )
  } else {
    cy.get(RiskOfHarmCommunityPage.riskToChildrenRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }

  if (dataTable.hashes()[2]['Option to be verified'] === 'Yes') {
    cy.get(RiskOfHarmCommunityPage.violentOffencesRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
    Common.getText(RiskOfHarmCommunityPage.violentOffencesDetails).should(
      'contain',
      dataTable.hashes()[2]['Text to be verified in Give Details'],
    )
  } else {
    cy.get(RiskOfHarmCommunityPage.violentOffencesRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }

  if (dataTable.hashes()[3]['Option to be verified'] === 'Yes') {
    cy.get(RiskOfHarmCommunityPage.acquisitiveOffendingRBtnYes)
      .should('have.attr', 'type', 'radio')
      .should('be.checked')
    Common.getText(RiskOfHarmCommunityPage.acquisitiveOffendingDetails).should(
      'contain',
      dataTable.hashes()[3]['Text to be verified in Give Details'],
    )
  } else {
    cy.get(RiskOfHarmCommunityPage.acquisitiveOffendingRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }

  if (dataTable.hashes()[4]['Option to be verified'] === 'Yes') {
    cy.get(RiskOfHarmCommunityPage.seriousGroupOffendingRBtnYes)
      .should('have.attr', 'type', 'radio')
      .should('be.checked')
    Common.getText(RiskOfHarmCommunityPage.seriousGroupOffendingDetails).should(
      'contain',
      dataTable.hashes()[4]['Text to be verified in Give Details'],
    )
  } else {
    cy.get(RiskOfHarmCommunityPage.seriousGroupOffendingRBtnNo)
      .should('have.attr', 'type', 'radio')
      .should('be.checked')
  }

  if (dataTable.hashes()[5]['Option to be verified'] === 'Yes') {
    cy.get(RiskOfHarmCommunityPage.controlIssuesRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
    Common.getText(RiskOfHarmCommunityPage.controlIssuesDetails).should(
      'contain',
      dataTable.hashes()[5]['Text to be verified in Give Details'],
    )
  } else {
    cy.get(RiskOfHarmCommunityPage.controlIssuesRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }

  if (dataTable.hashes()[6]['Option to be verified'] === 'Yes') {
    cy.get(RiskOfHarmCommunityPage.hateBehaviourRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
    Common.getText(RiskOfHarmCommunityPage.hateBehaviourDetails).should(
      'contain',
      dataTable.hashes()[6]['Text to be verified in Give Details'],
    )
  } else {
    cy.get(RiskOfHarmCommunityPage.hateBehaviourRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }

  if (dataTable.hashes()[7]['Option to be verified'] === 'Yes') {
    cy.get(RiskOfHarmCommunityPage.highProfilePersonRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
    Common.getText(RiskOfHarmCommunityPage.highProfilePersonDetails).should(
      'contain',
      dataTable.hashes()[7]['Text to be verified in Give Details'],
    )
  } else {
    cy.get(RiskOfHarmCommunityPage.highProfilePersonRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }

  if (dataTable.hashes()[8]['Option to be verified'] === 'Yes') {
    cy.get(RiskOfHarmCommunityPage.additionalRoshInfoRBtnYes).should('have.attr', 'type', 'radio').should('be.checked')
    Common.getText(RiskOfHarmCommunityPage.additionalRoshInfoDetails).should(
      'contain',
      dataTable.hashes()[8]['Text to be verified in Give Details'],
    )
  } else {
    cy.get(RiskOfHarmCommunityPage.additionalRoshInfoRBtnNo).should('have.attr', 'type', 'radio').should('be.checked')
  }
})
