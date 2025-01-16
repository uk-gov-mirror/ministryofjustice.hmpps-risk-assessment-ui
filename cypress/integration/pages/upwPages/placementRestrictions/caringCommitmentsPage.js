const caringCommitmntsDelius = '.govuk-list > li'
const caringCommitsAddtnlDetails = '#active_carer_commitments_details'
const markSectionCompleteRBtnYes = '#caring_commitments_complete'
const iWillComeBackLaterRBtn = '#caring_commitments_complete-2'

module.exports = {
  enterCaringCommitsAddtnlDetails: (details) => {
    cy.get(caringCommitsAddtnlDetails).as('caringCommitsAdditionalDetails').clear()
    cy.get('@caringCommitsAdditionalDetails').type(details)
  },

  selectCaringCommitsSectionComplete: (option) => {
    if (option === 'Yes') {
      cy.get(markSectionCompleteRBtnYes).check()
    } else {
      cy.get(iWillComeBackLaterRBtn).check()
    }
  },
  caringCommitsAddtnlDetails,
  markSectionCompleteRBtnYes,
  caringCommitmntsDelius,
  iWillComeBackLaterRBtn,
}
