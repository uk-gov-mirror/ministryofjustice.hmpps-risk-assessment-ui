const availabiltySummError = '[href="#individual_availability-error"]'
const availabiltyFieldError = '[id="individual_availability-error"]'
const mondayMorningAvlbltyCheckBox = '#individual_availability-0'
const mondayAfternoonAvlbltyCheckBox = '#individual_availability-1'
const mondayEveningAvlbltyCheckBox = '#individual_availability-2'
const tuesdayMorningAvlbltyCheckBox = '#individual_availability-3'
const tuesdayAfternoonAvlbltyCheckBox = '#individual_availability-4'
const tuesdayEveningAvlbltyCheckBox = '#individual_availability-5'
const wednesdayMorningAvlbltyCheckBox = '#individual_availability-6'
const wednesdayAfternoonAvlbltyCheckBox = '#individual_availability-7'
const wednesdayEveningAvlbltyCheckBox = '#individual_availability-8'
const thursdayMorningAvlbltyCheckBox = '#individual_availability-9'
const thursdayAfternoonAvlbltyCheckBox = '#individual_availability-10'
const thursdayEveningAvlbltyCheckBox = '#individual_availability-11'
const fridayMorningAvlbltyCheckBox = '#individual_availability-12'
const fridayAfternoonAvlbltyCheckBox = '#individual_availability-13'
const fridayEveningAvlbltyCheckBox = '#individual_availability-14'
const saturdayMorningAvlbltyCheckBox = '#individual_availability-15'
const saturdayAfternoonAvlbltyCheckBox = '#individual_availability-16'
const saturdayEveningAvlbltyCheckBox = '#individual_availability-17'
const sundayMorningAvlbltyCheckBox = '#individual_availability-18'
const sundayAfternoonAvlbltyCheckBox = '#individual_availability-19'
const sundayEveningAvlbltyCheckBox = '#individual_availability-20'
const availabilityInfoTextBox = '#individual_availability_details'
const markSectionCompleteRBtnYes = '#individual_availability_complete'
const iWillComeBackLaterRBtn = '#individual_availability_complete-2'

module.exports = {
  selectMondayAvailabilityStatus: (option) => {
    if (option === 'Morning-Yes') {
      cy.get(mondayMorningAvlbltyCheckBox).click()
    } else if (option === 'Afternoon-Yes') {
      cy.get(mondayAfternoonAvlbltyCheckBox).click()
    } else if (option === 'Evening-Yes') {
      cy.get(mondayEveningAvlbltyCheckBox).click()
    }
  },

  selectTuesdayAvailabilityStatus: (option) => {
    if (option === 'Morning-Yes') {
      cy.get(tuesdayMorningAvlbltyCheckBox).click()
    } else if (option === 'Afternoon-Yes') {
      cy.get(tuesdayAfternoonAvlbltyCheckBox).click()
    } else if (option === 'Evening-Yes') {
      cy.get(tuesdayEveningAvlbltyCheckBox).click()
    }
  },

  selectWednesdayAvailabilityStatus: (option) => {
    if (option === 'Morning-Yes') {
      cy.get(wednesdayMorningAvlbltyCheckBox).click()
    } else if (option === 'Afternoon-Yes') {
      cy.get(wednesdayAfternoonAvlbltyCheckBox).click()
    } else if (option === 'Evening-Yes') {
      cy.get(wednesdayEveningAvlbltyCheckBox).click()
    }
  },

  selectThursdayAvailabilityStatus: (option) => {
    if (option === 'Morning') {
      cy.get(thursdayMorningAvlbltyCheckBox).click()
    } else if (option === 'Afternoon-Yes') {
      cy.get(thursdayAfternoonAvlbltyCheckBox).click()
    } else if (option === 'Evening-Yes') {
      cy.get(thursdayEveningAvlbltyCheckBox).click()
    }
  },

  selectFridayAvailabilityStatus: (option) => {
    if (option === 'Morning-Yes') {
      cy.get(fridayMorningAvlbltyCheckBox).click()
    } else if (option === 'Afternoon-Yes') {
      cy.get(fridayAfternoonAvlbltyCheckBox).click()
    } else if (option === 'Evening-Yes') {
      cy.get(fridayEveningAvlbltyCheckBox).click()
    }
  },

  selectSaturdayAvailabilityStatus: (option) => {
    if (option === 'Morning-Yes') {
      cy.get(saturdayMorningAvlbltyCheckBox).click()
    } else if (option === 'Afternoon-Yes') {
      cy.get(saturdayAfternoonAvlbltyCheckBox).click()
    } else if (option === 'Evening-Yes') {
      cy.get(saturdayEveningAvlbltyCheckBox).click()
    }
  },

  selectSundayAvailabilityStatus: (option) => {
    if (option === 'Morning-Yes') {
      cy.get(sundayMorningAvlbltyCheckBox).click()
    } else if (option === 'Afternoon-Yes') {
      cy.get(sundayAfternoonAvlbltyCheckBox).click()
    } else if (option === 'Evening-Yes') {
      cy.get(sundayEveningAvlbltyCheckBox).click()
    }
  },

  enterAvailabilityInfoDetails: (details) => {
    cy.get(availabilityInfoTextBox).as('availabilityInfoTextBox').clear()
    cy.get('@availabilityInfoTextBox').type(details)
  },

  selectAvailabilitySectionComplete: (option) => {
    if (option === 'Yes') {
      cy.get(markSectionCompleteRBtnYes).click()
    } else {
      cy.get(iWillComeBackLaterRBtn).click()
    }
  },
  availabiltySummError,
  availabiltyFieldError,
  mondayMorningAvlbltyCheckBox,
  mondayAfternoonAvlbltyCheckBox,
  mondayEveningAvlbltyCheckBox,
  tuesdayMorningAvlbltyCheckBox,
  tuesdayAfternoonAvlbltyCheckBox,
  tuesdayEveningAvlbltyCheckBox,
  wednesdayMorningAvlbltyCheckBox,
  wednesdayAfternoonAvlbltyCheckBox,
  wednesdayEveningAvlbltyCheckBox,
  thursdayMorningAvlbltyCheckBox,
  thursdayAfternoonAvlbltyCheckBox,
  thursdayEveningAvlbltyCheckBox,
  fridayMorningAvlbltyCheckBox,
  fridayAfternoonAvlbltyCheckBox,
  fridayEveningAvlbltyCheckBox,
  saturdayMorningAvlbltyCheckBox,
  saturdayAfternoonAvlbltyCheckBox,
  saturdayEveningAvlbltyCheckBox,
  sundayMorningAvlbltyCheckBox,
  sundayAfternoonAvlbltyCheckBox,
  sundayEveningAvlbltyCheckBox,
  availabilityInfoTextBox,
  markSectionCompleteRBtnYes,
  iWillComeBackLaterRBtn,
}
