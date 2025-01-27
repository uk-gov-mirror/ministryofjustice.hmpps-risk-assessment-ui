const { When } = require('@badeball/cypress-cucumber-preprocessor')
const PdfPreviewPage = require('../../../integration/pages/upwPages/pdf-preview/pdfPreviewPage')
const Common = require('../../../integration/pages/upwPages/common/common')

When('I check the visual regression for {string}', (id) => {
  cy.compareSnapshot(id)
})

When('I see output {string} Page', (pageName) => {
  cy.url().should('include', pageName)
  cy.get(':nth-child(3) > .govuk-heading-l').contains('Supervised individual')
})

When(
  'I verify the {string} Section for offence and dates on the pdf-preview page as follows',
  (sectionName, dataTable) => {
    Common.getText(PdfPreviewPage.offenceDtlsSecHeading).should('equal', sectionName)
    Common.getText(PdfPreviewPage.offenceFld).should('equal', dataTable.hashes()[0]['Question name to be verified'])
    Common.getText(PdfPreviewPage.offenceDetails).should('equal', dataTable.hashes()[0]['Details to be verified'])
    Common.getText(PdfPreviewPage.subCodeFld).should('equal', dataTable.hashes()[1]['Question name to be verified'])
    Common.getText(PdfPreviewPage.subCodeDetails).should('equal', dataTable.hashes()[1]['Details to be verified'])
    Common.getText(PdfPreviewPage.sentenceDateFld).should(
      'equal',
      dataTable.hashes()[2]['Question name to be verified'],
    )
    Common.getText(PdfPreviewPage.sentenceDateDetails).should('equal', dataTable.hashes()[2]['Details to be verified'])
  },
)

When('I verify the {string} Section for personal info on the pdf-preview page as follows', (sectionName, dataTable) => {
  Common.getText(PdfPreviewPage.personalDtlsSecHeading).should('equal', sectionName)
  Common.getText(PdfPreviewPage.familyNameFld).should('equal', dataTable.hashes()[0]['Question name to be verified'])
  Common.getText(PdfPreviewPage.familyNameDetails).should('equal', dataTable.hashes()[0]['Details to be verified'])
  Common.getText(PdfPreviewPage.firstNameFld).should('equal', dataTable.hashes()[1]['Question name to be verified'])
  Common.getText(PdfPreviewPage.firstNameDetails).should('equal', dataTable.hashes()[1]['Details to be verified'])
  Common.getText(PdfPreviewPage.dobFld).should('equal', dataTable.hashes()[2]['Question name to be verified'])
  Common.getText(PdfPreviewPage.dobDetails).should('equal', dataTable.hashes()[2]['Details to be verified'])
  Common.getText(PdfPreviewPage.crnFld).should('equal', dataTable.hashes()[3]['Question name to be verified'])
  const expectedCrn = dataTable.hashes()[3]['Details to be verified']
  if (expectedCrn) {
    Common.getText(PdfPreviewPage.crnDetails).should('equal', expectedCrn)
  } else {
    cy.get('@crn').then((crn) => {
      Common.getText(PdfPreviewPage.crnDetails).should('equal', crn)
    })
  }
})

When(
  'I verify the {string} Section for gender details on the pdf-preview page as follows',
  (sectionName, dataTable) => {
    Common.getText(PdfPreviewPage.genderInfoSectionHeading).should('equal', sectionName)
    Common.getText(PdfPreviewPage.genderIdentityFld).should(
      'equal',
      dataTable.hashes()[0]['Question name to be verified'],
    )
    Common.getText(PdfPreviewPage.genderIdentityDetails).should(
      'equal',
      dataTable.hashes()[0]['Details to be verified'],
    )
    Common.getText(PdfPreviewPage.sexChangeQuestion).should(
      'equal',
      dataTable.hashes()[1]['Question name to be verified'],
    )
    Common.getText(PdfPreviewPage.sexChangeAnswer).should('equal', dataTable.hashes()[1]['Details to be verified'])
    Common.getText(PdfPreviewPage.sexChangeGiveDetailsQuestion).should(
      'contain',
      dataTable.hashes()[2]['Question name to be verified'],
    )
    Common.getText(PdfPreviewPage.sexChangeGiveDetailsAnswer).should(
      'equal',
      dataTable.hashes()[2]['Details to be verified'],
    )
    Common.getText(PdfPreviewPage.intersexOrDsdQuestion).should(
      'equal',
      dataTable.hashes()[3]['Question name to be verified'],
    )
    Common.getText(PdfPreviewPage.intersexOrDsdAnswer).should('equal', dataTable.hashes()[3]['Details to be verified'])
    Common.getText(PdfPreviewPage.transgenderQuestion).should(
      'contains',
      dataTable.hashes()[4]['Question name to be verified'],
    )
    Common.getText(PdfPreviewPage.transgenderAnswer).should('equal', dataTable.hashes()[4]['Details to be verified'])
  },
)

When('I verify the {string} Section for contact info on the pdf-preview page as follows', (sectionName, dataTable) => {
  Common.getText(PdfPreviewPage.contactInfoSectionHeading).should('equal', sectionName)
  Common.getText(PdfPreviewPage.addressFld).should('equal', dataTable.hashes()[0]['Question name to be verified'])
  Common.getText(PdfPreviewPage.address).should('contain', dataTable.hashes()[0]['Details to be verified'])
  Common.getText(PdfPreviewPage.address).should('contain', dataTable.hashes()[1]['Details to be verified'])
  Common.getText(PdfPreviewPage.address).should('contain', dataTable.hashes()[2]['Details to be verified'])
  Common.getText(PdfPreviewPage.address).should('contain', dataTable.hashes()[3]['Details to be verified'])
  Common.getText(PdfPreviewPage.address).should('contain', dataTable.hashes()[4]['Details to be verified'])
  Common.getText(PdfPreviewPage.address).should('contain', dataTable.hashes()[5]['Details to be verified'])
  Common.getText(PdfPreviewPage.mobileNrFld).should('equal', dataTable.hashes()[6]['Question name to be verified'])
  Common.getText(PdfPreviewPage.mobileNr).should('equal', dataTable.hashes()[6]['Details to be verified'])
  Common.getText(PdfPreviewPage.phoneNrFld).should('equal', dataTable.hashes()[7]['Question name to be verified'])
  Common.getText(PdfPreviewPage.phoneNr).should('equal', dataTable.hashes()[7]['Details to be verified'])
  Common.getText(PdfPreviewPage.emailFld).should('equal', dataTable.hashes()[8]['Question name to be verified'])
  Common.getText(PdfPreviewPage.email).should('equal', dataTable.hashes()[8]['Details to be verified'])
})

When('I verify the {string} Section for rosh info on the pdf-preview page as follows', (sectionName, dataTable) => {
  Common.getText(PdfPreviewPage.roshInfoSectionHeading).should('equal', sectionName)
  Common.getText(PdfPreviewPage.historySexualOffendingeFld).should(
    'equal',
    dataTable.hashes()[0]['Question name to be verified'],
  )
  Common.getText(PdfPreviewPage.historySexualOffendingOptionAndText).should(
    'contain',
    dataTable.hashes()[0]['Option to be verified'],
  )
  Common.getText(PdfPreviewPage.historySexualOffendingOptionAndText).should(
    'contain',
    dataTable.hashes()[0]['Text to be verified'],
  )
  Common.getText(PdfPreviewPage.riskToChildrenFld).should(
    'contain',
    dataTable.hashes()[1]['Question name to be verified'],
  )
  Common.getText(PdfPreviewPage.riskToChildrenOptionAndText).should(
    'contain',
    dataTable.hashes()[1]['Option to be verified'],
  )
  Common.getText(PdfPreviewPage.riskToChildrenOptionAndText).should(
    'contain',
    dataTable.hashes()[1]['Text to be verified'],
  )
  Common.getText(PdfPreviewPage.violentOffencesFld).should(
    'contain',
    dataTable.hashes()[2]['Question name to be verified'],
  )
  Common.getText(PdfPreviewPage.violentOffencesOptionAndText).should(
    'contain',
    dataTable.hashes()[2]['Option to be verified'],
  )
  Common.getText(PdfPreviewPage.violentOffencesOptionAndText).should(
    'contain',
    dataTable.hashes()[2]['Text to be verified'],
  )
  Common.getText(PdfPreviewPage.acquisitiveOffendingFld).should(
    'contain',
    dataTable.hashes()[3]['Question name to be verified'],
  )
  Common.getText(PdfPreviewPage.acquisitiveOffendingsOptionAndText).should(
    'contain',
    dataTable.hashes()[3]['Option to be verified'],
  )
  Common.getText(PdfPreviewPage.acquisitiveOffendingsOptionAndText).should(
    'contain',
    dataTable.hashes()[3]['Text to be verified'],
  )
  Common.getText(PdfPreviewPage.sgoIdentifierFld).should(
    'contain',
    dataTable.hashes()[4]['Question name to be verified'],
  )
  Common.getText(PdfPreviewPage.sgoIdentifierOptionAndText).should(
    'contain',
    dataTable.hashes()[4]['Option to be verified'],
  )
  Common.getText(PdfPreviewPage.sgoIdentifierOptionAndText).should(
    'contain',
    dataTable.hashes()[4]['Text to be verified'],
  )
  Common.getText(PdfPreviewPage.controlIssuesFld).should(
    'contain',
    dataTable.hashes()[5]['Question name to be verified'],
  )
  Common.getText(PdfPreviewPage.controlIssuesOptionAndText).should(
    'contain',
    dataTable.hashes()[5]['Option to be verified'],
  )
  Common.getText(PdfPreviewPage.controlIssuesOptionAndText).should(
    'contain',
    dataTable.hashes()[5]['Text to be verified'],
  )
  Common.getText(PdfPreviewPage.historyOfHateBehaviourFld).should(
    'contain',
    dataTable.hashes()[6]['Question name to be verified'],
  )
  Common.getText(PdfPreviewPage.historyOfHateBehaviourOptionAndText).should(
    'contain',
    dataTable.hashes()[6]['Option to be verified'],
  )
  Common.getText(PdfPreviewPage.historyOfHateBehaviourOptionAndText).should(
    'contain',
    dataTable.hashes()[6]['Text to be verified'],
  )
  Common.getText(PdfPreviewPage.historyOfHateBehaviourFld).should(
    'contain',
    dataTable.hashes()[7]['Question name to be verified'],
  )
  Common.getText(PdfPreviewPage.highProfilePersonFld).should(
    'contain',
    dataTable.hashes()[8]['Question name to be verified'],
  )
  Common.getText(PdfPreviewPage.highProfilePersonOptionAndText).should(
    'contain',
    dataTable.hashes()[8]['Option to be verified'],
  )
  Common.getText(PdfPreviewPage.highProfilePersonOptionAndText).should(
    'contain',
    dataTable.hashes()[8]['Text to be verified'],
  )
  Common.getText(PdfPreviewPage.highProfilePersonFld).should(
    'contain',
    dataTable.hashes()[9]['Question name to be verified'],
  )
  Common.getText(PdfPreviewPage.additionalInfoFld).should(
    'contain',
    dataTable.hashes()[10]['Question name to be verified'],
  )
  Common.getText(PdfPreviewPage.additionalInfoOptionAndText).should(
    'contain',
    dataTable.hashes()[10]['Option to be verified'],
  )
  Common.getText(PdfPreviewPage.additionalInfoOptionAndText).should(
    'contain',
    dataTable.hashes()[10]['Text to be verified'],
  )
})

When(
  'I verify the {string} Section for risk management info on the pdf-preview page as follows',
  (sectionName, dataTable) => {
    Common.getText(PdfPreviewPage.riskMngmntInfoSectionHeading).should('equal', sectionName)
    Common.getText(PdfPreviewPage.mappaNominalFld).should(
      'equal',
      dataTable.hashes()[0]['Question name to be verified'],
    )
    Common.getText(PdfPreviewPage.locationExclusionFld).should(
      'contain',
      dataTable.hashes()[1]['Question name to be verified'],
    )
    Common.getText(PdfPreviewPage.locationExclusionOptionAndText).should(
      'contain',
      dataTable.hashes()[1]['Option to be verified'],
    )
    Common.getText(PdfPreviewPage.locationExclusionOptionAndText).should(
      'contain',
      dataTable.hashes()[1]['Text to be verified'],
    )
    Common.getText(PdfPreviewPage.restrictedPlacementFld).should(
      'contain',
      dataTable.hashes()[2]['Question name to be verified'],
    )
    Common.getText(PdfPreviewPage.restrictedPlacementOptionAndText).should(
      'contain',
      dataTable.hashes()[2]['Option to be verified'],
    )
    Common.getText(PdfPreviewPage.restrictedPlacementOptionAndText).should(
      'contain',
      dataTable.hashes()[2]['Text to be verified'],
    )
    Common.getText(PdfPreviewPage.noFemaleSupervisonFld).should(
      'equal',
      dataTable.hashes()[3]['Question name to be verified'],
    )
    Common.getText(PdfPreviewPage.noFemaleSupervisonAndText).should(
      'contain',
      dataTable.hashes()[3]['Option to be verified'],
    )
    Common.getText(PdfPreviewPage.noFemaleSupervisonAndText).should(
      'contain',
      dataTable.hashes()[3]['Text to be verified'],
    )
    Common.getText(PdfPreviewPage.noMaleSupervisonFld).should(
      'equal',
      dataTable.hashes()[4]['Question name to be verified'],
    )
    Common.getText(PdfPreviewPage.noMaleSupervisonAndText).should(
      'contain',
      dataTable.hashes()[4]['Option to be verified'],
    )
    Common.getText(PdfPreviewPage.noMaleSupervisonAndText).should(
      'contain',
      dataTable.hashes()[4]['Text to be verified'],
    )
    Common.getText(PdfPreviewPage.restrictiveOrdersFld).should(
      'equal',
      dataTable.hashes()[5]['Question name to be verified'],
    )
    Common.getText(PdfPreviewPage.restrictiveOrdersOptionAndText).should(
      'contain',
      dataTable.hashes()[5]['Option to be verified'],
    )
    Common.getText(PdfPreviewPage.restrictiveOrdersOptionAndText).should(
      'contain',
      dataTable.hashes()[5]['Text to be verified'],
    )
    Common.getText(PdfPreviewPage.riskMngmntIssuesIndvdlFld).should(
      'equal',
      dataTable.hashes()[6]['Question name to be verified'],
    )
    Common.getText(PdfPreviewPage.riskMngmntIssuesIndvdlOptionAndText).should(
      'contain',
      dataTable.hashes()[6]['Option to be verified'],
    )
    Common.getText(PdfPreviewPage.riskMngmntIssuesIndvdlOptionAndText).should(
      'contain',
      dataTable.hashes()[6]['Text to be verified'],
    )
    Common.getText(PdfPreviewPage.riskMngmntIssuesSupervisedFld).should(
      'equal',
      dataTable.hashes()[7]['Question name to be verified'],
    )
    Common.getText(PdfPreviewPage.riskMngmntIssuesSupervisedAndText).should(
      'contain',
      dataTable.hashes()[7]['Option to be verified'],
    )
    Common.getText(PdfPreviewPage.riskMngmntIssuesSupervisedAndText).should(
      'contain',
      dataTable.hashes()[7]['Text to be verified'],
    )
    Common.getText(PdfPreviewPage.alcoholDrugIssuesFld).should(
      'equal',
      dataTable.hashes()[8]['Question name to be verified'],
    )
    Common.getText(PdfPreviewPage.alcoholDrugIssuesOptionAndText).should(
      'contain',
      dataTable.hashes()[8]['Option to be verified'],
    )
    Common.getText(PdfPreviewPage.alcoholDrugIssuesOptionAndText).should(
      'contain',
      dataTable.hashes()[8]['Text to be verified'],
    )
  },
)

When(
  'I verify the {string} Section for diversity info on the pdf-preview page as follows',
  (sectionName, dataTable) => {
    Common.getText(PdfPreviewPage.diversityInfoSectionHeading).should('equal', sectionName)
    Common.getText(PdfPreviewPage.languageFld).should('equal', dataTable.hashes()[0]['Question name to be verified'])
    Common.getText(PdfPreviewPage.requiresInterpreterFld).should(
      'contain',
      dataTable.hashes()[1]['Question name to be verified'],
    )
    Common.getText(PdfPreviewPage.requiresInterpreterOptionAndText).should(
      'contain',
      dataTable.hashes()[1]['Option to be verified'],
    )
    Common.getText(PdfPreviewPage.culturalReligiousAdjstmnsFld).should(
      'equal',
      dataTable.hashes()[2]['Question name to be verified'],
    )
    Common.getText(PdfPreviewPage.culturalReligiousAdjstmnsOptionAndText).should(
      'contain',
      dataTable.hashes()[2]['Option to be verified'],
    )
    Common.getText(PdfPreviewPage.culturalReligiousAdjstmnsOptionAndText).should(
      'contain',
      dataTable.hashes()[2]['Text to be verified'],
    )
    Common.getText(PdfPreviewPage.placementPreferencesFld).should(
      'equal',
      dataTable.hashes()[3]['Question name to be verified'],
    )
    Common.getText(PdfPreviewPage.placementPreferencesOptionAndText).should(
      'equal',
      dataTable.hashes()[3]['Option to be verified'],
    )
  },
)

When('I verify the {string} disabilities Section for {string}', (sectionName, subSection, dataTable) => {
  Common.getText(PdfPreviewPage.placementRestrictionsSectionName).should('equal', sectionName)
  if (subSection === 'Disabilities and mental health') {
    Common.getText(PdfPreviewPage.activeDisabilitiesSubHeading).should(
      'equal',
      dataTable.hashes()[0]['Question name to be verified'],
    )
    Common.getText(PdfPreviewPage.activeDisabilitiesOneFld).should(
      'equal',
      dataTable.hashes()[1]['Question name to be verified'],
    )
    Common.getText(PdfPreviewPage.activeDisabilitiesOneCommentsAdjstmnts)
      .then((text) => text.replace(/\n/g, ' '))
      .should('include', dataTable.hashes()[1]['Comments to be verified'])
    Common.getText(PdfPreviewPage.activeDisabilitiesOneCommentsAdjstmnts)
      .then((text) => text.replace(/\n/g, ' '))
      .should('include', dataTable.hashes()[1].Adjustments)
    Common.getText(PdfPreviewPage.activeDisabilitiesTwoFld).should(
      'equal',
      dataTable.hashes()[2]['Question name to be verified'],
    )
    Common.getText(PdfPreviewPage.activeDisabilitiesTwoCommentsAdjstmnts)
      .then((text) => text.replace(/\n/g, ' '))
      .should('include', dataTable.hashes()[2]['Comments to be verified'])
    Common.getText(PdfPreviewPage.activeDisabilitiesTwoCommentsAdjstmnts)
      .then((text) => text.replace(/\n/g, ' '))
      .should('include', dataTable.hashes()[2].Adjustments)
    Common.getText(PdfPreviewPage.activeDisabilitiesThreeFld).should(
      'equal',
      dataTable.hashes()[3]['Question name to be verified'],
    )
    Common.getText(PdfPreviewPage.activeDisabilitiesThreeCommentsAdjstmnts)
      .then((text) => text.replace(/\n/g, ' '))
      .should('include', dataTable.hashes()[3]['Comments to be verified'])
    Common.getText(PdfPreviewPage.activeDisabilitiesThreeCommentsAdjstmnts)
      .then((text) => text.replace(/\n/g, ' '))
      .should('include', dataTable.hashes()[3].Adjustments)
    Common.getText(PdfPreviewPage.activeDisabilitiesFourFld).should(
      'equal',
      dataTable.hashes()[4]['Question name to be verified'],
    )
    Common.getText(PdfPreviewPage.activeDisabilitiesFourCommentsAdjstmnts)
      .then((text) => text.replace(/\n/g, ' '))
      .should('include', dataTable.hashes()[4]['Comments to be verified'])
    Common.getText(PdfPreviewPage.activeDisabilitiesFourCommentsAdjstmnts)
      .then((text) => text.replace(/\n/g, ' '))
      .should('include', dataTable.hashes()[4].Adjustments)
    Common.getText(PdfPreviewPage.activeDisabilitiesFiveFld).should(
      'equal',
      dataTable.hashes()[5]['Question name to be verified'],
    )
    Common.getText(PdfPreviewPage.activeDisabilitiesFiveCommentsAdjstmnts)
      .then((text) => text.replace(/\n/g, ' '))
      .should('include', dataTable.hashes()[5]['Comments to be verified'])
    Common.getText(PdfPreviewPage.activeDisabilitiesFiveCommentsAdjstmnts)
      .then((text) => text.replace(/\n/g, ' '))
      .should('include', dataTable.hashes()[5].Adjustments)
    Common.getText(PdfPreviewPage.activeDisabilitiesSixFld).should(
      'equal',
      dataTable.hashes()[6]['Question name to be verified'],
    )
    Common.getText(PdfPreviewPage.activeDisabilitiesSixCommentsAdjstmnts)
      .then((text) => text.replace(/\n/g, ' '))
      .should('include', dataTable.hashes()[6]['Comments to be verified'])
    Common.getText(PdfPreviewPage.activeDisabilitiesSixCommentsAdjstmnts)
      .then((text) => text.replace(/\n/g, ' '))
      .should('include', dataTable.hashes()[6].Adjustments)
  } else if (subSection === 'Questions') {
    Common.getText(PdfPreviewPage.additionalDisabilitiesFld).should(
      'equal',
      dataTable.hashes()[0]['Question name to be verified'].replaceAll("'", '’'),
    )
    Common.getText(PdfPreviewPage.additionalDisabilitiesOptionAndText).should(
      'contain',
      dataTable.hashes()[0]['Option to be verified'],
    )
    Common.getText(PdfPreviewPage.additionalDisabilitiesOptionAndText).should(
      'contain',
      dataTable.hashes()[0]['Text to be verified'],
    )
    Common.getText(PdfPreviewPage.disabilitiesFld).should(
      'contain',
      dataTable.hashes()[1]['Question name to be verified'].replaceAll("'", '’'),
    )
    Common.getText(PdfPreviewPage.disabilitiesOption).should('contain', dataTable.hashes()[1]['Option to be verified'])
    Common.getText(PdfPreviewPage.disabilitiesFld).should(
      'contain',
      dataTable.hashes()[2]['Question name to be verified'],
    )
  }
})

When('I verify the {string} health issues Section', (sectionName, dataTable) => {
  Common.getText(PdfPreviewPage.healthIssuesSectionHeading).should('equal', sectionName)
  Common.getText(PdfPreviewPage.allergiesFld).should('equal', dataTable.hashes()[0]['Question name to be verified'])
  Common.getText(PdfPreviewPage.allergiesOptionAndText).should(
    'contain',
    dataTable.hashes()[0]['Option to be verified'],
  )
  Common.getText(PdfPreviewPage.allergiesOptionAndText).should('contain', dataTable.hashes()[0]['Text to be verified'])
  Common.getText(PdfPreviewPage.lossConsciousnessFld).should(
    'equal',
    dataTable.hashes()[1]['Question name to be verified'],
  )
  Common.getText(PdfPreviewPage.lossConsciousnessOptionAndText).should(
    'contain',
    dataTable.hashes()[1]['Option to be verified'],
  )
  Common.getText(PdfPreviewPage.lossConsciousnessOptionAndText).should(
    'contain',
    dataTable.hashes()[1]['Text to be verified'],
  )
  Common.getText(PdfPreviewPage.epilepsyFld).should('equal', dataTable.hashes()[2]['Question name to be verified'])
  Common.getText(PdfPreviewPage.epilepsyOptionAndText).should('contain', dataTable.hashes()[2]['Option to be verified'])
  Common.getText(PdfPreviewPage.epilepsyOptionAndText).should('contain', dataTable.hashes()[2]['Text to be verified'])
  Common.getText(PdfPreviewPage.pregnancyFld).should('equal', dataTable.hashes()[3]['Question name to be verified'])
  Common.getText(PdfPreviewPage.pregnancyOptionAndText).should(
    'contain',
    dataTable.hashes()[3]['Option to be verified'],
  )
  Common.getText(PdfPreviewPage.pregnancyOptionAndText).should('contain', dataTable.hashes()[3]['Text to be verified'])
  Common.getText(PdfPreviewPage.otherHealthIssuesFld).should(
    'equal',
    dataTable.hashes()[4]['Question name to be verified'],
  )
  Common.getText(PdfPreviewPage.otherHealthIssuesyOptionAndText).should(
    'contain',
    dataTable.hashes()[4]['Option to be verified'],
  )
  Common.getText(PdfPreviewPage.otherHealthIssuesyOptionAndText).should(
    'contain',
    dataTable.hashes()[4]['Text to be verified'],
  )
})

When('I verify the GP contact {string} in GP Contact Section as follows', (index, dataTable) => {
  dataTable.hashes().forEach((row) => {
    const field = row['Question name to be verified']
    const expectedValue = row['Details to be verified']

    switch (field) {
      case 'Name':
        Common.getText(PdfPreviewPage.gpCntctNameFld(index)).should('equal', field)
        Common.getText(PdfPreviewPage.gpCntctName(index)).should('equal', expectedValue)
        break
      case 'GP practice name':
        Common.getText(PdfPreviewPage.gpCntctPracticeNameFld(index)).should('equal', field)
        Common.getText(PdfPreviewPage.gpCntctPracticeName(index)).should('equal', expectedValue)
        break
      case 'Address':
        Common.getText(PdfPreviewPage.gpCntctAddressFld(index)).should('equal', field)
        Common.getText(PdfPreviewPage.gpCntctAddress(index)).should('contain', expectedValue)
        break
      case 'Phone number':
        Common.getText(PdfPreviewPage.gpCntctPhoneNumberFld(index)).should('equal', field)
        Common.getText(PdfPreviewPage.gpCntctPhoneNumber(index)).should('equal', expectedValue)
        break
      default:
        throw new Error(`Unexpected field: ${field}`)
    }
  })
})

When('I verify the {string} travel issues Section', (sectionName, dataTable) => {
  Common.getText(PdfPreviewPage.travelIssuesSectionHeading).should('equal', sectionName)
  Common.getText(PdfPreviewPage.travelInfoFld).should('equal', dataTable.hashes()[0]['Question name to be verified'])
  Common.getText(PdfPreviewPage.travelInfoOptionAndText).should(
    'contain',
    dataTable.hashes()[0]['Option to be verified'],
  )
  Common.getText(PdfPreviewPage.travelInfoOptionAndText).should('contain', dataTable.hashes()[0]['Text to be verified'])
  Common.getText(PdfPreviewPage.drivingLicenceFld).should(
    'equal',
    dataTable.hashes()[1]['Question name to be verified'],
  )
  Common.getText(PdfPreviewPage.drivingLicenceOption).should('equal', dataTable.hashes()[1]['Option to be verified'])
  Common.getText(PdfPreviewPage.vehicleFld).should('equal', dataTable.hashes()[2]['Question name to be verified'])
  Common.getText(PdfPreviewPage.vehicleOption).should('equal', dataTable.hashes()[2]['Option to be verified'])
  Common.getText(PdfPreviewPage.publicTransportFld).should(
    'equal',
    dataTable.hashes()[3]['Question name to be verified'],
  )
  Common.getText(PdfPreviewPage.publicTransportOption).should('equal', dataTable.hashes()[3]['Option to be verified'])
})

When('I verify the {string} Section for carer details', (sectionName, dataTable) => {
  Common.getText(PdfPreviewPage.carerCommtmntsSectionHeading).should('equal', sectionName)
  Common.getText(PdfPreviewPage.activeCarerCommitmentsFld).should(
    'equal',
    dataTable.hashes()[0]['Question name to be verified'],
  )
  Common.getText(PdfPreviewPage.activeCarerCommitmentsAnswer).should(
    'equal',
    dataTable.hashes()[0]['Answer to be verified'],
  )
  Common.getText(PdfPreviewPage.addtnlCarerCommitmentsFld).should(
    'equal',
    dataTable.hashes()[1]['Question name to be verified'],
  )
  Common.getText(PdfPreviewPage.addtnlCarerCommitmentsAnswer).should(
    'equal',
    dataTable.hashes()[1]['Answer to be verified'],
  )
})

When('I verify the {string} EESkills Section', (sectionName, dataTable) => {
  Common.getText(PdfPreviewPage.empEduSkillsSectionHeading).should('equal', sectionName)
  Common.getText(PdfPreviewPage.employmentEducationFld).should(
    'equal',
    dataTable.hashes()[0]['Question name to be verified'],
  )
  Common.getText(PdfPreviewPage.employmentEducationOption).should(
    'equal',
    dataTable.hashes()[0]['Option to be verified'],
  )
  Common.getText(PdfPreviewPage.employmentEducationWorkingHrsFld).should(
    'equal',
    dataTable.hashes()[1]['Question name to be verified'],
  )
  Common.getText(PdfPreviewPage.employmentEducationWorkingHrsText).should(
    'equal',
    dataTable.hashes()[1]['Text to be verified'],
  )
  Common.getText(PdfPreviewPage.readingWritingDifficultiesFld).should(
    'equal',
    dataTable.hashes()[2]['Question name to be verified'],
  )
  Common.getText(PdfPreviewPage.readingWritingDifficultiesOptionAndText).should(
    'contain',
    dataTable.hashes()[2]['Option to be verified'],
  )
  Common.getText(PdfPreviewPage.readingWritingDifficultiesOptionAndText).should(
    'contain',
    dataTable.hashes()[2]['Text to be verified'],
  )
  Common.getText(PdfPreviewPage.workSkillsFld).should('equal', dataTable.hashes()[3]['Question name to be verified'])
  Common.getText(PdfPreviewPage.workSkillsOptionAndText).should(
    'contain',
    dataTable.hashes()[3]['Option to be verified'],
  )
  Common.getText(PdfPreviewPage.workSkillsOptionAndText).should('contain', dataTable.hashes()[3]['Text to be verified'])
  Common.getText(PdfPreviewPage.futureWorkPlansFld).should(
    'contain',
    dataTable.hashes()[4]['Question name to be verified'],
  )
  Common.getText(PdfPreviewPage.futureWorkPlansOptionAndText).should(
    'contain',
    dataTable.hashes()[4]['Option to be verified'],
  )
  Common.getText(PdfPreviewPage.futureWorkPlansOptionAndText).should(
    'contain',
    dataTable.hashes()[4]['Text to be verified'],
  )
  Common.getText(PdfPreviewPage.futureWorkPlansFld).should(
    'contain',
    dataTable.hashes()[5]['Question name to be verified'],
  )
})

When('I verify the {string} training Section', (sectionName, dataTable) => {
  Common.getText(PdfPreviewPage.trainingEmplSectionHeading).should('equal', sectionName)
  Common.getText(PdfPreviewPage.educationTrainingNeedFld).should(
    'equal',
    dataTable.hashes()[0]['Question name to be verified'],
  )
  Common.getText(PdfPreviewPage.educationTrainingNeedOptionAndText).should(
    'contain',
    dataTable.hashes()[0]['Option to be verified'],
  )
  Common.getText(PdfPreviewPage.educationTrainingNeedOptionAndText).should(
    'contain',
    dataTable.hashes()[0]['Text to be verified'],
  )
  Common.getText(PdfPreviewPage.individualCommitmentFld).should(
    'equal',
    dataTable.hashes()[1]['Question name to be verified'],
  )
  Common.getText(PdfPreviewPage.individualCommitmentOptionAndText).should(
    'contain',
    dataTable.hashes()[1]['Option to be verified'],
  )
  Common.getText(PdfPreviewPage.individualCommitmentOptionAndText).should(
    'contain',
    dataTable.hashes()[1]['Text to be verified'],
  )
})

When('I verify the {string} availability Section', (sectionName, dataTable) => {
  Common.getText(PdfPreviewPage.availabilitySectionHeading).should('equal', sectionName)
  if (dataTable.hashes()[0].Monday === 'Morning-Yes') {
    Common.getText(PdfPreviewPage.availabilityMondayMorning).should('contain', '✓')
  } else {
    Common.getText(PdfPreviewPage.availabilityMondayMorning).should('be.empty')
  }
  if (dataTable.hashes()[1].Monday === 'Afternoon-Yes') {
    Common.getText(PdfPreviewPage.availabilityMondayAfternoon).should('contain', '✓')
  } else {
    Common.getText(PdfPreviewPage.availabilityMondayAfternoon).should('be.empty')
  }
  if (dataTable.hashes()[2].Monday === 'Evening-Yes') {
    Common.getText(PdfPreviewPage.availabilityMondayEvening).should('contain', '✓')
  } else {
    Common.getText(PdfPreviewPage.availabilityMondayEvening).should('be.empty')
  }
  if (dataTable.hashes()[0].Tuesday === 'Morning-Yes') {
    Common.getText(PdfPreviewPage.availabilityTuesdayMorning).should('contain', '✓')
  } else {
    Common.getText(PdfPreviewPage.availabilityTuesdayMorning).should('be.empty')
  }
  if (dataTable.hashes()[1].Tuesday === 'Afternoon-Yes') {
    Common.getText(PdfPreviewPage.availabilityTuesdayAfternoon).should('contain', '✓')
  } else {
    Common.getText(PdfPreviewPage.availabilityTuesdayAfternoon).should('be.empty')
  }
  if (dataTable.hashes()[2].Tuesday === 'Evening-Yes') {
    Common.getText(PdfPreviewPage.availabilityTuesdayEvening).should('contain', '✓')
  } else {
    Common.getText(PdfPreviewPage.availabilityTuesdayEvening).should('be.empty')
  }
  if (dataTable.hashes()[0].Wednesday === 'Morning-Yes') {
    Common.getText(PdfPreviewPage.availabilityWednesdayMorning).should('contain', '✓')
  } else {
    Common.getText(PdfPreviewPage.availabilityWednesdayMorning).should('be.empty')
  }
  if (dataTable.hashes()[1].Wednesday === 'Afternoon-Yes') {
    Common.getText(PdfPreviewPage.availabilityWednesdayAfternoon).should('contain', '✓')
  } else {
    Common.getText(PdfPreviewPage.availabilityWednesdayAfternoon).should('be.empty')
  }
  if (dataTable.hashes()[2].Wednesday === 'Evening-Yes') {
    Common.getText(PdfPreviewPage.availabilityWednesdayEvening).should('contain', '✓')
  } else {
    Common.getText(PdfPreviewPage.availabilityWednesdayEvening).should('be.empty')
  }
  if (dataTable.hashes()[0].Thursday === 'Morning-Yes') {
    Common.getText(PdfPreviewPage.availabilityThursdayMorning).should('contain', '✓')
  } else {
    Common.getText(PdfPreviewPage.availabilityThursdayMorning).should('be.empty')
  }
  if (dataTable.hashes()[1].Thursday === 'Afternoon-Yes') {
    Common.getText(PdfPreviewPage.availabilityThursdayAfternoon).should('contain', '✓')
  } else {
    Common.getText(PdfPreviewPage.availabilityThursdayAfternoon).should('be.empty')
  }
  if (dataTable.hashes()[2].Thursday === 'Evening-Yes') {
    Common.getText(PdfPreviewPage.availabilityThursdayEvening).should('contain', '✓')
  } else {
    Common.getText(PdfPreviewPage.availabilityThursdayEvening).should('be.empty')
  }
  if (dataTable.hashes()[0].Friday === 'Morning-Yes') {
    Common.getText(PdfPreviewPage.availabilityFridayMorning).should('contain', '✓')
  } else {
    Common.getText(PdfPreviewPage.availabilityFridayMorning).should('be.empty')
  }
  if (dataTable.hashes()[1].Friday === 'Afternoon-Yes') {
    Common.getText(PdfPreviewPage.availabilityFridayAfternoon).should('contain', '✓')
  } else {
    Common.getText(PdfPreviewPage.availabilityFridayAfternoon).should('be.empty')
  }
  if (dataTable.hashes()[2].Friday === 'Evening-Yes') {
    Common.getText(PdfPreviewPage.availabilityFridayEvening).should('contain', '✓')
  } else {
    Common.getText(PdfPreviewPage.availabilityFridayEvening).should('be.empty')
  }
  if (dataTable.hashes()[0].Saturday === 'Morning-Yes') {
    Common.getText(PdfPreviewPage.availabilitySaturdayMorning).should('contain', '✓')
  } else {
    Common.getText(PdfPreviewPage.availabilitySaturdayMorning).should('be.empty')
  }
  if (dataTable.hashes()[1].Saturday === 'Afternoon-Yes') {
    Common.getText(PdfPreviewPage.availabilitySaturdayAfternoon).should('contain', '✓')
  } else {
    Common.getText(PdfPreviewPage.availabilitySaturdayAfternoon).should('be.empty')
  }
  if (dataTable.hashes()[2].Saturday === 'Evening-Yes') {
    Common.getText(PdfPreviewPage.availabilitySaturdayEvening).should('contain', '✓')
  } else {
    Common.getText(PdfPreviewPage.availabilitySaturdayEvening).should('be.empty')
  }
  if (dataTable.hashes()[0].Sunday === 'Morning-Yes') {
    Common.getText(PdfPreviewPage.availabilitySundayMorning).should('contain', '✓')
  } else {
    Common.getText(PdfPreviewPage.availabilitySundayMorning).should('be.empty')
  }
  if (dataTable.hashes()[1].Sunday === 'Afternoon-Yes') {
    Common.getText(PdfPreviewPage.availabilitySundayAfternoon).should('contain', '✓')
  } else {
    Common.getText(PdfPreviewPage.availabilitySundayAfternoon).should('be.empty')
  }
  if (dataTable.hashes()[2].Sunday === 'Evening-Yes') {
    Common.getText(PdfPreviewPage.availabilitySundayEvening).should('contain', '✓')
  } else {
    Common.getText(PdfPreviewPage.availabilitySundayEvening).should('be.empty')
  }
})

When('I verify the Additional availability information Section', (dataTable) => {
  Common.getText(PdfPreviewPage.additionalAvailabilityFld).should(
    'equal',
    dataTable.hashes()[0]['Question name to be verified'],
  )
  Common.getText(PdfPreviewPage.additionalAvailabilityAnswer).should(
    'equal',
    dataTable.hashes()[0]['Answer to be verified'],
  )
})

When('I verify the {string} clothing and footwear Section', (sectionName, dataTable) => {
  Common.getText(PdfPreviewPage.equipmentSectionHeading).should('equal', sectionName)
  Common.getText(PdfPreviewPage.maleFemaleClothingFld).should(
    'equal',
    dataTable.hashes()[0]['Question name to be verified'],
  )
  Common.getText(PdfPreviewPage.maleFemaleClothingOption).should(
    'equal',
    dataTable.hashes()[0]['Option to be verified'],
  )
  Common.getText(PdfPreviewPage.waterproofClothingFld).should(
    'equal',
    dataTable.hashes()[1]['Question name to be verified'],
  )
  Common.getText(PdfPreviewPage.waterproofClothingOption).should(
    'equal',
    dataTable.hashes()[1]['Option to be verified'],
  )
  Common.getText(PdfPreviewPage.footwearSizeFld).should('equal', dataTable.hashes()[2]['Question name to be verified'])
  Common.getText(PdfPreviewPage.footwearSizeOption).should('equal', dataTable.hashes()[2]['Option to be verified'])
})

When(
  'I verify the {string} in {string} Section as follows on the PDF Preview page',
  (subSection, sectionName, dataTable) => {
    Common.getText(PdfPreviewPage.emrgncyCntctDtlsSectionHeading).should('equal', sectionName)
    if (subSection === 'Emergency contact 1' && sectionName === 'Emergency contact details') {
      Common.getText(PdfPreviewPage.emrgncyCntctOneSectionHeading).should('equal', subSection)
      Common.getText(PdfPreviewPage.emrgncyCntctOneNameFld).should(
        'equal',
        dataTable.hashes()[0]['Question name to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctOneName).should(
        'equal',
        dataTable.hashes()[0]['Details to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctOneSurnameFld).should(
        'equal',
        dataTable.hashes()[1]['Question name to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctOneSurname).should(
        'equal',
        dataTable.hashes()[1]['Details to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctOneRelationshipFld).should(
        'equal',
        dataTable.hashes()[2]['Question name to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctOneRelationship).should(
        'equal',
        dataTable.hashes()[2]['Details to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctOneMobileFld).should(
        'equal',
        dataTable.hashes()[3]['Question name to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctOneMobile).should(
        'equal',
        dataTable.hashes()[3]['Details to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctOnePhoneNumberFld).should(
        'equal',
        dataTable.hashes()[4]['Question name to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctOnePhoneNumber).should(
        'equal',
        dataTable.hashes()[4]['Details to be verified'],
      )
    } else if (subSection === 'Emergency contact 2' && sectionName === 'Emergency contact details') {
      Common.getText(PdfPreviewPage.emrgncyCntctTwoSectionHeading).should('equal', subSection)
      Common.getText(PdfPreviewPage.emrgncyCntctTwoNameFld).should(
        'equal',
        dataTable.hashes()[0]['Question name to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctTwoName).should(
        'equal',
        dataTable.hashes()[0]['Details to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctTwoSurnameFld).should(
        'equal',
        dataTable.hashes()[1]['Question name to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctTwoSurname).should(
        'equal',
        dataTable.hashes()[1]['Details to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctTwoRelationshipFld).should(
        'equal',
        dataTable.hashes()[2]['Question name to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctTwoRelationship).should(
        'equal',
        dataTable.hashes()[2]['Details to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctTwoMobileFld).should(
        'equal',
        dataTable.hashes()[3]['Question name to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctTwoMobile).should(
        'equal',
        dataTable.hashes()[3]['Details to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctTwoPhoneNumberFld).should(
        'equal',
        dataTable.hashes()[4]['Question name to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctTwoPhoneNumber).should(
        'equal',
        dataTable.hashes()[4]['Details to be verified'],
      )
    } else if (subSection === 'Emergency contact 3' && sectionName === 'Emergency contact details') {
      Common.getText(PdfPreviewPage.emrgncyCntctThreeSectionHeading).should('equal', subSection)
      Common.getText(PdfPreviewPage.emrgncyCntctThreeNameFld).should(
        'equal',
        dataTable.hashes()[0]['Question name to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctThreeName).should(
        'equal',
        dataTable.hashes()[0]['Details to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctThreeSurnameFld).should(
        'equal',
        dataTable.hashes()[1]['Question name to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctThreeSurname).should(
        'equal',
        dataTable.hashes()[1]['Details to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctThreeRelationshipFld).should(
        'equal',
        dataTable.hashes()[2]['Question name to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctThreeRelationship).should(
        'equal',
        dataTable.hashes()[2]['Details to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctThreeMobileFld).should(
        'equal',
        dataTable.hashes()[3]['Question name to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctThreeMobile).should(
        'equal',
        dataTable.hashes()[3]['Details to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctThreePhoneNumberFld).should(
        'equal',
        dataTable.hashes()[4]['Question name to be verified'],
      )
      Common.getText(PdfPreviewPage.emrgncyCntctThreePhoneNumber).should(
        'equal',
        dataTable.hashes()[4]['Details to be verified'],
      )
    }
  },
)
