const clothingMaleRBtn = '#male_female_clothing'
const clothingFemaleRBtn = '#male_female_clothing-2'
const clothingMaleFemaleSummError = '[href="#male_female_clothing-error"]'
const clothingMaleFemaleFieldError = '[id="male_female_clothing-error"]'
const xsmallClothingRBtn = '#waterproof_clothing'
const smallClothingRBtn = '#waterproof_clothing-2'
const mediumClothingRBtn = '#waterproof_clothing-3'
const largeClothingRBtn = '#waterproof_clothing-4'
const xlargeClothingRBtn = '#waterproof_clothing-5'
const xxlargeClothingRBtn = '#waterproof_clothing-6'
const xxxlargeClothingRBtn = '#waterproof_clothing-7'
const clothingSizeSummError = '[href="#waterproof_clothing-error"]'
const clothingSizeFieldError = '[id="waterproof_clothing-error"]'
const footwearDropdown = '#footwear_size'
const footwearSizeSummError = '[href="#footwear_size-error"]'
const footwearSizeFieldError = '[id="footwear_size-error"]'
const markSectionCompleteRBtnYes = '#equipment_complete'
const iWillComeBackLaterRBtn = '#equipment_complete-2'

module.exports = {
  selectMaleFemaleClothingStatus: (option) => {
    if (option === 'Male') {
      cy.get(clothingMaleRBtn).check()
    } else if (option === 'Female') {
      cy.get(clothingFemaleRBtn).check()
    }
  },

  selectWaterproofClothingSize: (option) => {
    if (option === 'X-Small') {
      cy.get(xsmallClothingRBtn).check()
    } else if (option === 'Small') {
      cy.get(smallClothingRBtn).check()
    } else if (option === 'Medium') {
      cy.get(mediumClothingRBtn).check()
    } else if (option === 'Large') {
      cy.get(largeClothingRBtn).check()
    } else if (option === 'X-Large') {
      cy.get(xlargeClothingRBtn).check()
    } else if (option === 'XX-Large') {
      cy.get(xxlargeClothingRBtn).check()
    } else if (option === 'XXX-Large') {
      cy.get(xxxlargeClothingRBtn).check()
    }
  },

  selectFootwearSize: (size) => {
    cy.get(footwearDropdown).select(size)
  },

  selectEquipmentSectionComplete: (option) => {
    if (option === 'Yes') {
      cy.get(markSectionCompleteRBtnYes).check()
    } else {
      cy.get(iWillComeBackLaterRBtn).check()
    }
  },
  clothingMaleRBtn,
  clothingFemaleRBtn,
  clothingMaleFemaleSummError,
  clothingMaleFemaleFieldError,
  xsmallClothingRBtn,
  smallClothingRBtn,
  mediumClothingRBtn,
  largeClothingRBtn,
  xlargeClothingRBtn,
  xxlargeClothingRBtn,
  xxxlargeClothingRBtn,
  clothingSizeSummError,
  clothingSizeFieldError,
  footwearDropdown,
  footwearSizeSummError,
  footwearSizeFieldError,
  markSectionCompleteRBtnYes,
  iWillComeBackLaterRBtn,
}
