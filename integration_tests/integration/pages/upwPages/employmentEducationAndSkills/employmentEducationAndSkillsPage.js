const fullTimeEmplEducationRBtn = '#employment_education'
const partTimeEmplEducationRBtn = '#employment_education-2'
const noEmplEducationRBtn = '#employment_education-3'
const emplEducationSummError = '[href="#employment_education-error"]'
const emplEducationFieldError = '[id="employment_education-error"]'
const fullTimeEmplEducationDetails = '#employment_education_details_fulltime'
const partTimeEmplEducationDetails = '#employment_education_details_parttime'
const fullTimeEmplEducationDetailsSummError = '[href="#employment_education_details_fulltime-error"]'
const fullTimeEmplEducationDetailsFieldError = '[id="employment_education_details_fulltime-error"]'
const partTimeEmplEducationDetailsSummError = '[href="#employment_education_details_parttime-error"]'
const partTimeEmplEducationDetailsFieldError = '[id="employment_education_details_parttime-error"]'
const readWriteDifficultiesRBtnYes = '#reading_writing_difficulties'
const readWriteDifficultiesRBtnNo = '#reading_writing_difficulties-2'
const readWriteDifficultiesSummError = '[href="#reading_writing_difficulties-error"]'
const readWriteDifficultiesFieldError = '[id="reading_writing_difficulties-error"]'
const readWriteDifficultiesDetails = '#reading_writing_difficulties_details'
const readWriteDifficultDetailsSummError = '[href="#reading_writing_difficulties_details-error"]'
const readWriteDifficultDetailsFieldError = '[id="reading_writing_difficulties_details-error"]'
const workSkillsRBtnYes = '#work_skills'
const workSkillsRBtnNo = '#work_skills-2'
const workSkillsSummError = '[href="#work_skills-error"]'
const workSkillsFieldError = '[id="work_skills-error"]'
const workSkillsDetails = '#work_skills_details'
const workSkillsDetailsSummError = '[href="#work_skills_details-error"]'
const workSkillsDetailsFieldError = '[id="work_skills_details-error"]'
const futureWorkPlansRBtnYes = '#future_work_plans'
const futureWorkPlansRBtnNo = '#future_work_plans-2'
const futureWorkPlansSummError = '[href="#future_work_plans-error"]'
const futureWorkPlansFieldError = '[id="future_work_plans-error"]'
const futureWorkPlansDetails = '#future_work_plans_details'
const futureWorkPlansDetailsSummError = '[href="#future_work_plans_details-error"]'
const futureWorkPlansDetailsFieldError = '[id="future_work_plans_details-error"]'
const markSectionCompleteRBtnYes = '#employment_education_skills_complete'
const iWillComeBackLaterRBtn = '#employment_education_skills_complete-2'

module.exports = {
  selectEmplEducationStatus: (option) => {
    if (option === 'Full-time education or employment') {
      cy.get(fullTimeEmplEducationRBtn).check()
    } else if (option === 'Part-time education or employment') {
      cy.get(partTimeEmplEducationRBtn).check()
    } else if (option === 'No') {
      cy.get(noEmplEducationRBtn).check()
    }
  },

  enterFullTimeEmplEducationDetails: (details) => {
    cy.get(fullTimeEmplEducationDetails).as('fullTimeEmploymentEducationDetails').clear()
    cy.get('@fullTimeEmploymentEducationDetails').type(details)
  },

  enterPartTimeEmplEducationDetails: (details) => {
    cy.get(partTimeEmplEducationDetails).as('partTimeEmploymentEducationDetails').clear()
    cy.get('@partTimeEmploymentEducationDetails').type(details)
  },

  selectReadWriteDifficultiesStatus: (option) => {
    if (option === 'Yes') {
      cy.get(readWriteDifficultiesRBtnYes).check()
    } else if (option === 'No') {
      cy.get(readWriteDifficultiesRBtnNo).check()
    }
  },

  enterReadWriteDifficultiesDetails: (details) => {
    cy.get(readWriteDifficultiesDetails).as('readWriteDifficultiesDetails').clear()
    cy.get('@readWriteDifficultiesDetails').type(details)
  },

  selectWorkSkillsStatus: (option) => {
    if (option === 'Yes') {
      cy.get(workSkillsRBtnYes).check()
    } else if (option === 'No') {
      cy.get(workSkillsRBtnNo).check()
    }
  },

  enterWorkSkillsDetails: (details) => {
    cy.get(workSkillsDetails).as('workSkillsDetails').clear()
    cy.get('@workSkillsDetails').type(details)
  },

  selectFutureWorkPlansStatus: (option) => {
    if (option === 'Yes') {
      cy.get(futureWorkPlansRBtnYes).check()
    } else if (option === 'No') {
      cy.get(futureWorkPlansRBtnNo).check()
    }
  },

  enterFutureWorkPlansDetails: (details) => {
    cy.get(futureWorkPlansDetails).as('futureWorkPlansDetails').clear()
    cy.get('@futureWorkPlansDetails').type(details)
  },

  selectEmplEducationSkillsSectionComplete: (option) => {
    if (option === 'Yes') {
      cy.get(markSectionCompleteRBtnYes).check()
    } else {
      cy.get(iWillComeBackLaterRBtn).check()
    }
  },
  fullTimeEmplEducationRBtn,
  partTimeEmplEducationRBtn,
  noEmplEducationRBtn,
  emplEducationSummError,
  emplEducationFieldError,
  fullTimeEmplEducationDetails,
  partTimeEmplEducationDetails,
  fullTimeEmplEducationDetailsSummError,
  fullTimeEmplEducationDetailsFieldError,
  partTimeEmplEducationDetailsSummError,
  partTimeEmplEducationDetailsFieldError,
  readWriteDifficultiesRBtnYes,
  readWriteDifficultiesRBtnNo,
  readWriteDifficultiesSummError,
  readWriteDifficultiesFieldError,
  readWriteDifficultiesDetails,
  readWriteDifficultDetailsSummError,
  readWriteDifficultDetailsFieldError,
  workSkillsRBtnYes,
  workSkillsRBtnNo,
  workSkillsSummError,
  workSkillsFieldError,
  workSkillsDetails,
  workSkillsDetailsSummError,
  workSkillsDetailsFieldError,
  futureWorkPlansRBtnYes,
  futureWorkPlansRBtnNo,
  futureWorkPlansSummError,
  futureWorkPlansFieldError,
  futureWorkPlansDetails,
  futureWorkPlansDetailsSummError,
  futureWorkPlansDetailsFieldError,
  markSectionCompleteRBtnYes,
  iWillComeBackLaterRBtn,
}
