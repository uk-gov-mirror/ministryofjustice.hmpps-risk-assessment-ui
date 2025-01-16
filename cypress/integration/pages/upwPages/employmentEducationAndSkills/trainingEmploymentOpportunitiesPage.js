const educationTrainingNeedRBtnYes = '#education_training_need'
const educationTrainingNeedRBtnNo = '#education_training_need-2'
const educationTrainingNeedDetails = '#education_training_need_details'
const educationTrainingNeedSummError = '[href="#education_training_need-error"]'
const educationTrainingNeedFieldError = '[id="education_training_need-error"]'
const educTrainingNeedDetailsSummError = '[href="#education_training_need_details-error"]'
const educTrainingNeedDetailsFieldError = '[id="education_training_need_details-error"]'
const individCommitmentRBtnYes = '#individual_commitment'
const individCommitmentRBtnNo = '#individual_commitment-2'
const individCommitmentSummError = '[href="#individual_commitment-error"]'
const individCommitmentFieldError = '[id="individual_commitment-error"]'
const individCommitmentDetails = '#individual_commitment_details'
const individCommitmentDetailsSummError = '[href="#individual_commitment_details-error"]'
const individCommitmentDetailsFieldError = '[id="individual_commitment_details-error"]'
const markSectionCompleteRBtnYes = '#employment_training_complete'
const iWillComeBackLaterRBtn = '#employment_training_complete-2'

module.exports = {
  selectEducationTrainingNeedStatus: (option) => {
    if (option === 'Yes') {
      cy.get(educationTrainingNeedRBtnYes).check()
    } else if (option === 'No') {
      cy.get(educationTrainingNeedRBtnNo).check()
    }
  },

  enterEducationTrainingNeedDetails: (details) => {
    cy.get(educationTrainingNeedDetails).as('educationTrainingNeedDetails').clear()
    cy.get('@educationTrainingNeedDetails').type(details)
  },

  selectIndividCommitmentStatus: (option) => {
    if (option === 'Yes') {
      cy.get(individCommitmentRBtnYes).check()
    } else if (option === 'No') {
      cy.get(individCommitmentRBtnNo).check()
    }
  },

  enterIndividCommitmentDetails: (details) => {
    cy.get(individCommitmentDetails).as('individualCommitmentDetails').clear()
    cy.get('@individualCommitmentDetails').type(details)
  },

  selectTrainingNeedSectionComplete: (option) => {
    if (option === 'Yes') {
      cy.get(markSectionCompleteRBtnYes).check()
    } else {
      cy.get(iWillComeBackLaterRBtn).check()
    }
  },
  educationTrainingNeedRBtnYes,
  educationTrainingNeedRBtnNo,
  educationTrainingNeedDetails,
  educationTrainingNeedSummError,
  educationTrainingNeedFieldError,
  educTrainingNeedDetailsSummError,
  educTrainingNeedDetailsFieldError,
  individCommitmentRBtnYes,
  individCommitmentRBtnNo,
  individCommitmentSummError,
  individCommitmentFieldError,
  individCommitmentDetails,
  individCommitmentDetailsSummError,
  individCommitmentDetailsFieldError,
  markSectionCompleteRBtnYes,
  iWillComeBackLaterRBtn,
}
