module.exports = {
  'conducted-an-interview': {
    text: 'Have you conducted an interview?',
    helpText: 'A hint',
    validate: [
      {
        type: 'required',
      },
    ],
    type: 'radios',
    items: [
      { text: 'Yes', value: 'yes' },
      { text: 'No', value: 'no' },
    ],
  },
}
