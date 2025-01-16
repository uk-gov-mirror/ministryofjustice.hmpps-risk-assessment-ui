const eligibilityIntenseWorkRBtnYes = '#eligibility_intensive_working'
const eligibilityIntenseWorkRBtnNo = '#eligibility_intensive_working-2'
const eligibilityIntensWorkSummError = '[href="#eligibility_intensive_working-error"]'
const eligibilityIntensWorkFieldError = '[id="eligibility_intensive_working-error"]'
const recommendedHoursStartOrderTextBox = '#recommended_hours_start_order'
const recommendedHoursStartOrderSummError = '[href="#recommended_hours_start_order-error"]'
const recommendedHoursStartOrderFieldError = '[id="recommended_hours_start_order-error"]'
const recommendedHoursMidOrderTextBox = '#recommended_hours_midpoint_order'
const recommendedHoursMidOrderSummError = '[href="#recommended_hours_midpoint_order-error"]'
const recommendedHoursMidOrderFieldError = '[id="recommended_hours_midpoint_order-error"]'
const twentyEightHoursWeekDetails = '#twenty_eight_hours_working_week_details'
const twentyEightHoursWeekSummError = '[href="#twenty_eight_hours_working_week_details-error"]'
const twentyEightHoursWeekFieldError = '[id="twenty_eight_hours_working_week_details-error"]'
const eligibilityIntensWorkDetailsNo = '#eligibility_intensive_working_details'
const eligibilityIntenseWorkDetailsNoSummError = '[href="#eligibility_intensive_working_details-error"]'
const eligibilityIntenseWorkDetailsNoFieldError = '[id="eligibility_intensive_working_details-error"]'
const markSectionCompleteRBtnYes = '#eligibility_intensive_working_complete'
const iWillComeBackLaterRBtn = '#eligibility_intensive_working_complete-2'

module.exports = {
  selectEligibilityIntenseWorkStatus: (option) => {
    if (option === 'Yes') {
      cy.get(eligibilityIntenseWorkRBtnYes).check()
    } else if (option === 'No') {
      cy.get(eligibilityIntenseWorkRBtnNo).check()
    }
  },

  enterRecommendedHoursStartOrder: (details) => {
    cy.get(recommendedHoursStartOrderTextBox).as('recommendedHoursStartOrderTextBox').clear()
    cy.get('@recommendedHoursStartOrderTextBox').type(details)
  },

  enterRecommendedHoursMidOrder: (details) => {
    cy.get(recommendedHoursMidOrderTextBox).as('recommendedHoursMidOrderTextBox').clear()
    cy.get('@recommendedHoursMidOrderTextBox').type(details)
  },

  enterTwentyEightHoursWeekDetails: (details) => {
    cy.get(twentyEightHoursWeekDetails).as('twentyEightHoursWeekDetails').clear()
    cy.get('@twentyEightHoursWeekDetails').type(details)
  },

  enterEligibilityIntenseWorkNoDetails: (details) => {
    cy.get(eligibilityIntensWorkDetailsNo).as('eligibilityIntenseWorkDetailsNo').clear()
    cy.get('@eligibilityIntenseWorkDetailsNo').type(details)
  },

  selectIntesiveWorkingSectionComplete: (option) => {
    if (option === 'Yes') {
      cy.get(markSectionCompleteRBtnYes).check()
    } else {
      cy.get(iWillComeBackLaterRBtn).check()
    }
  },
  eligibilityIntenseWorkRBtnYes,
  eligibilityIntenseWorkRBtnNo,
  eligibilityIntensWorkSummError,
  eligibilityIntensWorkFieldError,
  recommendedHoursStartOrderTextBox,
  recommendedHoursStartOrderSummError,
  recommendedHoursStartOrderFieldError,
  recommendedHoursMidOrderTextBox,
  recommendedHoursMidOrderSummError,
  recommendedHoursMidOrderFieldError,
  twentyEightHoursWeekDetails,
  twentyEightHoursWeekSummError,
  twentyEightHoursWeekFieldError,
  eligibilityIntensWorkDetailsNo,
  eligibilityIntenseWorkDetailsNoSummError,
  eligibilityIntenseWorkDetailsNoFieldError,
  markSectionCompleteRBtnYes,
  iWillComeBackLaterRBtn,
}
