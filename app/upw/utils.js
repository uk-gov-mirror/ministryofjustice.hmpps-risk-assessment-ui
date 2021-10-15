const addSectionCompleteField = (fields, section) => ({
  ...fields,
  [`section-complete-${section}`]: {
    questionText: 'Mark this sections as complete?',
    questionCode: `section-complete-${section}`,
    answerType: 'radio',
    validate: ['required'],
    answerSchemas: [
      { text: 'Yes', value: 'YES' },
      { text: 'No', value: 'NO' },
    ],
  },
})

module.exports = {
  addSectionCompleteField,
}
