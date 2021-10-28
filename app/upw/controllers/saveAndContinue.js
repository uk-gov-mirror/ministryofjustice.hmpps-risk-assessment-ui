const BaseSaveAndContinue = require('../../common/controllers/saveAndContinue')

const completionFields = [
  'upw_individual_details_complete',
  'upw_cultural_religious_adjustment_complete',
  'upw_placement_preference_complete',
  'upw_placement_preference_by_gender_complete',
  'upw_rosh_community_complete',
  'upw_managing_risk_complete',
  'upw_disabilities_complete',
  'upw_health_issues_complete',
  'upw_gp_details_complete',
  'upw_travel_information_complete',
  'upw_caring_commitments_complete',
  'upw_employment_education_skills_complete',
  'upw_employment_training_complete',
  'upw_eligibility_intensive_working_complete',
  'upw_individual_availability_complete',
  'upw_equipment_complete',
]

const removeAnswers = fieldsToRemove => answers =>
  Object.entries(answers).reduce((modifiedAnswers, [fieldName, answer]) => {
    if (fieldsToRemove.includes(fieldName)) {
      return {
        ...modifiedAnswers,
        [fieldName]: '',
      }
    }

    return {
      ...modifiedAnswers,
      [fieldName]: answer,
    }
  }, {})

const setDefaultCompletedAnswers = (answers, fields) => {
  const newAnswers = answers
  fields.forEach(field => {
    if (!newAnswers[field] || newAnswers[field] === '') {
      newAnswers[field] = 'NO_ILL_COME_BACK_LATER'
    }
  })

  return newAnswers
}

const invalidateDeclarations = removeAnswers(['declaration'])

class SaveAndContinue extends BaseSaveAndContinue {
  locals(req, res, next) {
    super.locals(req, res, next)

    const answers = req.sessionModel.get('answers') || {}
    const updatedAnswers = setDefaultCompletedAnswers(answers, completionFields)
    req.sessionModel.set('answers', updatedAnswers)
  }

  saveValues(req, res, next) {
    const answers = req.sessionModel.get('answers') || {}
    const answersWithInvalidatedDeclarations = invalidateDeclarations(answers)
    req.sessionModel.set('answers', answersWithInvalidatedDeclarations)

    super.saveValues(req, res, next)
  }
}

module.exports = SaveAndContinue
