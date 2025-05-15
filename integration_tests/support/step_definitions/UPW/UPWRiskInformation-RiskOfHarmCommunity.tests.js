const { Then } = require('@badeball/cypress-cucumber-preprocessor')
const RiskOfHarmCommunityPage = require('../../../integration/pages/upwPages/riskInformation/riskOfHarmCommunityPage')

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
