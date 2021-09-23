const {
  dateIsAfter,
  dateIsAfterOrEqual,
  yearsBetweenGreaterThan,
  yearsBetweenLessThan,
  range,
  notInFuture,
  validDate,
} = require('../../common/middleware/form-wizard-validators/validators')

const customValidations = (fields, offenderDob, dateFirstSanction, totalSanctions) => {
  fields.date_first_sanction.validate.push({
    fn: dateIsAfter,
    arguments: [offenderDob],
    message: 'Date must be later than the individual’s date of birth',
  })
  fields.date_first_sanction.validate.push({
    fn: yearsBetweenGreaterThan,
    arguments: [offenderDob, 8],
    message: 'The individual must be aged 8 or older on the date of first sanction',
  })
  fields.total_violent_offences.validate.push({
    fn: range,
    arguments: [0, totalSanctions],
    message: 'Cannot be greater than the total number of sanctions for all offences',
  })
  fields.date_current_conviction.validate.push({
    fn: dateIsAfter,
    arguments: [offenderDob],
    message: 'Date must be later than the individual’s date of birth',
  })
  fields.date_current_conviction.validate.push({
    fn: dateIsAfterOrEqual,
    arguments: [dateFirstSanction],
    message: 'Current conviction cannot be before the date of first conviction',
  })
  fields.most_recent_sexual_offence_date.validate.push({
    fn: dateIsAfter,
    arguments: [offenderDob],
    message: 'Date must be later than the individual’s date of birth',
  })
  fields.earliest_release_date.validate.push({
    fn: dateIsAfter,
    arguments: [offenderDob],
    message: 'Date must be later than the individual’s date of birth',
  })
  fields.earliest_release_date.validate.push({
    fn: yearsBetweenLessThan,
    arguments: [offenderDob, 110],
    message: 'The individual must be aged 110 or younger on commencement',
  })
  return fields
}

const fields = {
  date_first_sanction: {
    validate: [
      {
        fn: validDate,
        message: 'Enter a valid date',
      },
      {
        fn: notInFuture,
        message: 'Date cannot be in the future',
      },
    ],
  },
  total_sanctions: {
    type: 'number',
    validate: [
      {
        fn: range,
        arguments: [1, 999],
        message: 'Enter a number between 1 and 999',
      },
    ],
  },
  total_violent_offences: {
    validate: [],
    type: 'number',
  },
  date_current_conviction: {
    validate: [
      {
        fn: validDate,
        message: 'Enter a valid date',
      },
      {
        fn: notInFuture,
        message: 'Date cannot be in the future',
      },
    ],
  },
  any_sexual_offences: {
    validate: [
      {
        type: 'required',
        message: 'Select yes or no',
      },
    ],
  },
  current_sexual_offence: {
    dependent: { field: 'any_sexual_offences', value: 'YES' },
    validate: [
      {
        type: 'required',
        message: 'Select yes or no',
      },
    ],
  },
  most_recent_sexual_offence_date: {
    dependent: { field: 'any_sexual_offences', value: 'YES' },
    validate: [
      {
        fn: validDate,
        message: 'Enter a valid date',
      },
      {
        fn: notInFuture,
        message: 'Date cannot be in the future',
      },
    ],
  },
  total_sexual_offences_adult: {
    dependent: { field: 'any_sexual_offences', value: 'YES' },
    validate: [
      { type: 'required', message: 'Enter a number' },
      {
        fn: range,
        arguments: [0, 99],
        message: 'Enter a number',
      },
    ],
  },
  total_sexual_offences_child: {
    dependent: { field: 'any_sexual_offences', value: 'YES' },
    validate: [
      { type: 'required', message: 'Enter a number' },
      {
        fn: range,
        arguments: [0, 99],
        message: 'Enter a number',
      },
    ],
  },
  total_sexual_offences_child_image: {
    dependent: { field: 'any_sexual_offences', value: 'YES' },
    validate: [
      { type: 'required', message: 'Enter a number' },
      {
        fn: range,
        arguments: [0, 99],
        message: 'Enter a number',
      },
    ],
  },
  total_non_contact_sexual_offences: {
    dependent: { field: 'any_sexual_offences', value: 'YES' },
    validate: [
      { type: 'required', message: 'Enter a number' },
      {
        fn: range,
        arguments: [0, 99],
        message: 'Enter a number',
      },
    ],
  },
  earliest_release_date: {
    validate: [
      { type: 'required', message: 'Enter a number' },
      {
        fn: validDate,
        message: 'Enter a valid date',
      },
    ],
  },
  age_first_conviction: {
    validate: [
      {
        type: 'required',
        message: 'Enter a number',
      },
    ],
  },
  completed_interview: {
    validate: [
      {
        type: 'required',
        message: 'Select yes or no',
      },
    ],
  },
  suitable_accommodation: {
    validate: [
      {
        type: 'required',
        message: 'Select an option',
      },
    ],
  },
  unemployed_on_release: {
    validate: [
      {
        type: 'required',
        message: 'Select yes or no',
      },
    ],
  },
  current_relationship_with_partner: {
    validate: [
      {
        type: 'required',
        message: 'Select an option',
      },
    ],
  },
  evidence_domestic_violence: {
    validate: [
      {
        type: 'required',
        message: 'Select yes or no',
      },
    ],
  },
  use_of_alcohol: {
    validate: [
      {
        type: 'required',
        message: 'Select an option',
      },
    ],
  },
  binge_drinking: {
    validate: [
      {
        type: 'required',
        message: 'Select an option',
      },
    ],
  },
  impulsivity_issues: {
    validate: [
      {
        type: 'required',
        message: 'Select an option',
      },
    ],
  },
  temper_control_issues: {
    validate: [
      {
        type: 'required',
        message: 'Select an option',
      },
    ],
  },
  pro_criminal_attitudes: {
    validate: [
      {
        type: 'required',
        message: 'Select an option',
      },
    ],
  },
  current_possession_firearm: {
    validate: [
      {
        type: 'required',
        message: 'Select yes or no',
      },
    ],
  },
  current_offence_weapon: {
    validate: [
      {
        type: 'required',
        message: 'Select yes or no',
      },
    ],
  },
  previous_murder_attempt: {
    validate: [
      {
        type: 'required',
        message: 'Select yes or no',
      },
    ],
  },
  previous_wounding: {
    validate: [
      {
        type: 'required',
        message: 'Select yes or no',
      },
    ],
  },
  previous_aggravated_burglary: {
    validate: [
      {
        type: 'required',
        message: 'Select yes or no',
      },
    ],
  },
  previous_arson: {
    validate: [
      {
        type: 'required',
        message: 'Select yes or no',
      },
    ],
  },
  previous_criminal_damage: {
    validate: [
      {
        type: 'required',
        message: 'Select yes or no',
      },
    ],
  },
  previous_possession_firearm: {
    validate: [
      {
        type: 'required',
        message: 'Select yes or no',
      },
    ],
  },
  previous_robbery: {
    validate: [
      {
        type: 'required',
        message: 'Select yes or no',
      },
    ],
  },
  previous_offence_weapon: {
    validate: [
      {
        type: 'required',
        message: 'Select yes or no',
      },
    ],
  },
}

module.exports = {
  fields,
  customValidations,
}
