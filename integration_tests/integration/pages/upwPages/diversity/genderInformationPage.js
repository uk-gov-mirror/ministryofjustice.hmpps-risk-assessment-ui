const maleGenderRBtn = '#gender_identity'
const femaleGenderBtn = '#gender_identity-2'
const nonBinaryGenderRBtn = '#gender_identity-3'
const preferToSelfDescribeGenderRBtn = '#gender_identity-4'
const preferNotToSayGenderRBtn = '#gender_identity-5'
const genderIdentitySummError = '[href="#gender_identity-error"]'
const genderIdentityFieldError = '[id="gender_identity-error"]'
const sexChangeRBtnYes = '#sex_change'
const sexChangeRBtnNo = '#sex_change-2'
const sexChangeDetails = '#sex_change_details'
const sexChangeSummError = '[href="#sex_change-error"]'
const sexChangeFieldError = '[id="sex_change-error"]'
const sexChangeDetailsSummError = '[href="#sex_change_details-error"]'
const sexChangeDetailsFieldError = '[id="sex_change_details-error"]'
const intersexDSDRBtnYes = '#intersex_or_dsd'
const intersexDSDRBtnNo = '#intersex_or_dsd-2'
const intersexDSDSummError = '[href="#intersex_or_dsd-error"]'
const intersexDSDFieldError = '[id="intersex_or_dsd-error"]'
const transgenderRBtnYes = '#transgender'
const transgenderRBtnNo = '#transgender-2'
const transgenderSummError = '[href="#transgender-error"]'
const transgenderFieldError = '[id="transgender-error"]'
const markSectionCompleteRButtonYes = '#placement_preference_by_gender_complete'
const iWillComeBackLaterRButtonNo = '#placement_preference_by_gender_complete-2'

module.exports = {
  selectGenderIdentity: (option) => {
    if (option === 'Male') {
      cy.get(maleGenderRBtn).check()
    } else if (option === 'Female') {
      cy.get(femaleGenderBtn).check()
    } else if (option === 'Non-binary') {
      cy.get(nonBinaryGenderRBtn).check()
    } else if (option === 'Prefer to self-describe') {
      cy.get(preferToSelfDescribeGenderRBtn).check()
    } else if (option === 'Prefer not to say') {
      cy.get(preferNotToSayGenderRBtn).check()
    }
  },

  selectSexChangeStatus: (option) => {
    if (option === 'Yes') {
      cy.get(sexChangeRBtnYes).check()
    } else if (option === 'No') {
      cy.get(sexChangeRBtnNo).check()
    }
  },

  enterSexChangeDetails: (details) => {
    cy.get(sexChangeDetails).as('sexChangeDetails').clear()
    cy.get('@sexChangeDetails').type(details)
  },

  selectintersexDSDStatus: (option) => {
    if (option === 'Yes') {
      cy.get(intersexDSDRBtnYes).check()
    } else if (option === 'No') {
      cy.get(intersexDSDRBtnNo).check()
    }
  },

  selectTransgenderStatus: (option) => {
    if (option === 'Yes') {
      cy.get(transgenderRBtnYes).check()
    } else if (option === 'No') {
      cy.get(transgenderRBtnNo).check()
    }
  },

  selectGenderInformationSectionComplete: (option) => {
    if (option === 'Yes') {
      cy.get(markSectionCompleteRButtonYes).check()
    } else {
      cy.get(iWillComeBackLaterRButtonNo).check()
    }
  },
  maleGenderRBtn,
  femaleGenderBtn,
  nonBinaryGenderRBtn,
  preferToSelfDescribeGenderRBtn,
  preferNotToSayGenderRBtn,
  genderIdentitySummError,
  genderIdentityFieldError,
  sexChangeRBtnYes,
  sexChangeRBtnNo,
  sexChangeDetails,
  sexChangeSummError,
  sexChangeFieldError,
  sexChangeDetailsSummError,
  sexChangeDetailsFieldError,
  intersexDSDRBtnYes,
  intersexDSDRBtnNo,
  intersexDSDSummError,
  intersexDSDFieldError,
  transgenderRBtnYes,
  transgenderRBtnNo,
  transgenderSummError,
  transgenderFieldError,
  markSectionCompleteRButtonYes,
  iWillComeBackLaterRButtonNo,
}
