const addSectionCompleteField = (fields, section) => ({
  ...fields,
  [`section-complete-${section}`]: {
    questionText: 'Mark this section as complete?',
    questionCode: `section-complete-${section}`,
    answerType: 'radio',
    validate: ['required'],
    answerSchemas: [
      { text: 'Yes', value: 'YES' },
      { text: "No, I'll come back later", value: 'NO', checked: true },
    ],
  },
})

module.exports = {
  addSectionCompleteField,
}
