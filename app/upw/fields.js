const { addSectionCompleteField } = require('./utils')

let fields = {
  declaration: {
    questionText: '[PLACEHOLDER]',
    questionCode: 'declaration',
    answerType: 'checkbox',
    answerSchemas: [{ text: 'Complete', value: 'COMPLETE' }],
  },
  upw_cultural_religious_adjustment: {
    validate: [
      {
        type: 'required',
        message: 'Select yes or no',
      },
    ],
  },
  upw_cultural_religious_adjustment_details: {
    dependent: { field: 'upw_cultural_religious_adjustment', value: 'YES' },
    validate: [
      {
        type: 'required',
        message: 'Enter details',
      },
    ],
  },
  upw_placement_preference: {
    validate: [
      {
        type: 'required',
        message: 'Select yes or no',
      },
    ],
  },
  upw_placement_preferences: {
    dependent: { field: 'upw_placement_preference', value: 'YES' },
    validate: [
      {
        type: 'required',
        message: 'Enter details',
      },
    ],
  },
  upw_placement_preference_by_gender_details: {
    validate: [
      {
        type: 'required',
        message: 'Enter details',
      },
    ],
  },
}

Array.from([
  'individuals-details',
  'cultural-and-religious-adjustments',
  'placement-preferences',
  'options-gender-identity',
  'risk-of-harm-in-the-community',
  'managing-risk',
  'disabilities-and-mental-health',
  'health-issues',
  'travel',
  'caring-commitments',
  'employment-education-and-skills',
  'training-and-employment-opportunities',
  'availability',
  'intensive-working',
  'equipment',
]).forEach(sectionName => {
  fields = addSectionCompleteField(fields, sectionName)
})

// const customValidations = (fields, answers) => {
//   return fields
// }

module.exports = {
  fields,
}
