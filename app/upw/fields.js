const { addSectionCompleteField } = require('./utils')

let fields = {
  declaration: {
    questionText: '[PLACEHOLDER]',
    questionCode: 'declaration',
    answerType: 'checkbox',
    answerSchemas: [{ text: 'Complete', value: 'COMPLETE' }],
  },
}

Array.from([
  'individuals-details',
  'cultural-and-religious-adjustments',
  'placement-preferences',
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
  // customValidations,
}
