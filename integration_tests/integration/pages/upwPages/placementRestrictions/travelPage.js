const travelInfoRBtnYes = '#travel_information'
const travelInfoRBtnNo = '#travel_information-2'
const travelInfoDetails = '#travel_information_details'
const travelInfoSummError = '[href="#travel_information-error"]'
const travelInfoFieldError = '[id="travel_information-error"]'
const travelInfoDetailsSummError = '[href="#travel_information_details-error"]'
const travelInfoDetailsFieldError = '[id="travel_information_details-error"]'
const drivingLicenceRBtnYes = '#driving_licence'
const drivingLicenceRBtnNo = '#driving_licence-2'
const drivingLicenceSummError = '[href="#driving_licence-error"]'
const drivingLicenceFieldError = '[id="driving_licence-error"]'
const vehicleRBtnYes = '#vehicle'
const vehicleRBtnNo = '#driving_licence-2'
const vehicleSummError = '[href="#vehicle-error"]'
const vehicleFieldError = '[id="vehicle-error"]'
const publicTransportRBtnYes = '#public_transport'
const publicTransportRBtnNo = '#public_transport-2'
const publicTransportSummError = '[href="#public_transport-error"]'
const publicTransportFieldError = '[id="public_transport-error"]'
const markSectionCompleteRBtnYes = '#travel_information_complete'
const iWillComeBackLaterRBtn = '#travel_information_complete-2'

module.exports = {
  selectTravelInfoStatus: (option) => {
    if (option === 'Yes') {
      cy.get(travelInfoRBtnYes).check()
    } else if (option === 'No') {
      cy.get(travelInfoRBtnNo).check()
    }
  },

  enterTravelInfoDetails: (details) => {
    cy.get(travelInfoDetails).as('travelInfoDetails').clear()
    cy.get('@travelInfoDetails').type(details)
  },

  selectDrivingLicenceStatus: (option) => {
    if (option === 'Yes') {
      cy.get(drivingLicenceRBtnYes).check()
    } else if (option === 'No') {
      cy.get(drivingLicenceRBtnNo).check()
    }
  },

  selectPublicTransportStatus: (option) => {
    if (option === 'Yes') {
      cy.get(publicTransportRBtnYes).check()
    } else if (option === 'No') {
      cy.get(publicTransportRBtnNo).check()
    }
  },

  selectVehicleStatus: (option) => {
    if (option === 'Yes') {
      cy.get(vehicleRBtnYes).check()
    } else if (option === 'No') {
      cy.get(vehicleRBtnNo).check()
    }
  },

  selectTravelInfoSectionComplete: (option) => {
    if (option === 'Yes') {
      cy.get(markSectionCompleteRBtnYes).check()
    } else {
      cy.get(iWillComeBackLaterRBtn).check()
    }
  },
  travelInfoRBtnYes,
  travelInfoRBtnNo,
  travelInfoDetails,
  travelInfoSummError,
  travelInfoFieldError,
  travelInfoDetailsSummError,
  travelInfoDetailsFieldError,
  drivingLicenceRBtnYes,
  drivingLicenceRBtnNo,
  drivingLicenceSummError,
  drivingLicenceFieldError,
  vehicleRBtnYes,
  vehicleRBtnNo,
  vehicleSummError,
  vehicleFieldError,
  publicTransportRBtnYes,
  publicTransportRBtnNo,
  publicTransportSummError,
  publicTransportFieldError,
  markSectionCompleteRBtnYes,
  iWillComeBackLaterRBtn,
}
