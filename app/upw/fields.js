const { range, noSpace, onePresent } = require('../../common/middleware/form-wizard-validators/validators')

const customValidationsEditEmergencyContact = (fields, emergencyContactPhoneNumber, emergencyContactMobileNumber) => {
  fields.emergency_contact_phone_number?.validate.push({
    fn: onePresent,
    arguments: [emergencyContactMobileNumber],
    message: 'A phone number is required',
  })
  fields.emergency_contact_mobile_phone_number?.validate.push({
    fn: onePresent,
    arguments: [emergencyContactPhoneNumber],
    message: 'A mobile is required',
  })

  return fields
}

const customValidationsEditContactDetails = (
  fields,
  contactPhoneNumber,
  contactMobileNumber,
  contactAddressBuildingName,
  contactAddressHouseNumber,
) => {
  fields.contact_phone_number?.validate.push({
    fn: onePresent,
    arguments: [contactMobileNumber],
    message: 'You must provide details for Mobile or Phone number',
  })
  fields.contact_mobile_phone_number?.validate.push({
    fn: onePresent,
    arguments: [contactPhoneNumber],
    message: 'You must provide details for Mobile or Phone number',
  })
  fields.contact_address_building_name?.validate.push({
    fn: onePresent,
    arguments: [contactAddressHouseNumber],
    message: 'You must provide details for Building name or House number',
  })
  fields.contact_address_house_number?.validate.push({
    fn: onePresent,
    arguments: [contactAddressBuildingName],
    message: 'You must provide details for Building name or House number',
  })

  return fields
}

const customValidationsCaringCommitments = (fields, newCaringCommitmentsData) => {
  if (!newCaringCommitmentsData) {
    fields.caring_commitments?.validate.push(...requireYesOrNo.validate)
    fields.caring_commitments_details?.validate.push(...requireEnterDetails.validate)
  }

  return fields
}

const requireSelectOption = {
  validate: [
    {
      type: 'required',
      message: 'Select an option',
    },
  ],
}

const requireYesOrNo = {
  validate: [
    {
      type: 'required',
      message: 'Select yes or no',
    },
  ],
}

const requireEnterDetails = {
  validate: [
    {
      fn: noSpace,
      message: 'Enter details',
    },
    {
      type: 'required',
      message: 'Enter details',
    },
  ],
}

const readOnly = { readOnly: true }

const fields = {
  first_name_aliases: {
    answerType: 'textarea',
  },
  family_name_aliases: {
    answerType: 'textarea',
  },
  gender_identity: {
    validate: [{ type: 'required', message: 'Select a Gender Identity option' }],
  },
  sex_change: {
    validate: [
      {
        type: 'required',
        message:
          'Has the individual gone through any part of a process to change the sex they were assigned at birth to the gender they now identify with, or do they intend to? Select yes or no',
      },
    ],
  },
  sex_change_details: {
    dependent: { field: 'sex_change', value: 'YES' },
    validate: [
      {
        type: 'required',
        message: 'Enter details of gender identity and relevant placement options discussed with the individual.',
      },
    ],
  },
  intersex_or_dsd: {
    validate: [
      {
        type: 'required',
        message:
          'Is the individual intersex or do they have a Difference in Sexual Development (DSD)? Select yes or no',
      },
    ],
  },
  transgender: {
    validate: [
      {
        type: 'required',
        message: 'Do they consider themselves to be transgender or have a transgender history? Select yes or no',
      },
    ],
  },
  contact_address_building_name: {},
  contact_address_house_number: {},
  contact_address_street_name: {
    validate: [{ type: 'required', message: 'Street name is required' }],
  },
  contact_address_district: {},
  contact_address_town_or_city: {
    validate: [{ type: 'required', message: 'Town/City is required' }],
  },
  contact_address_county: {},
  contact_address_postcode: {
    validate: [{ type: 'required', message: 'Postcode is required' }],
  },
  contact_phone_number: {},
  contact_mobile_phone_number: {},
  contact_email_addresses: {
    validate: [{ type: 'required', message: 'Email address is required' }],
  },
  emergency_contact_first_name: {
    type: 'multiple',
    answerGroup: 'emergency_contact_details',
    validate: [{ type: 'required', message: 'Name is required' }],
  },
  emergency_contact_family_name: {
    type: 'multiple',
    answerGroup: 'emergency_contact_details',
    validate: [{ type: 'required', message: 'Surname is required' }],
  },
  emergency_contact_relationship: {
    type: 'multiple',
    answerGroup: 'emergency_contact_details',
    validate: [{ type: 'required', message: 'Emergency contact relationship is required' }],
  },
  emergency_contact_phone_number: {
    type: 'multiple',
    answerGroup: 'emergency_contact_details',
  },
  emergency_contact_mobile_phone_number: {
    type: 'multiple',
    answerGroup: 'emergency_contact_details',
  },
  cultural_religious_adjustment: {
    validate: [
      { type: 'required', message: 'Are adjustments required for cultural or religious reasons? Select yes or no' },
    ],
  },
  cultural_religious_adjustment_details: {
    dependent: { field: 'cultural_religious_adjustment', value: 'YES' },
    validate: [
      {
        type: 'required',
        message: 'Enter details of the adjustments required for cultural or religious reasons',
      },
    ],
  },
  placement_preference: requireYesOrNo,
  placement_preferences: {
    dependent: { field: 'placement_preference', value: 'YES' },
    ...requireSelectOption,
  },
  history_sexual_offending: {
    validate: [
      {
        type: 'required',
        message: 'Is there a history of sexual offending? Select yes or no',
      },
    ],
  },
  history_sexual_offending_details: {
    dependent: { field: 'history_sexual_offending', value: 'YES' },
    validate: [
      {
        type: 'required',
        message: 'Enter details of the sexual offending',
      },
    ],
  },
  poses_risk_to_children: {
    validate: [
      {
        type: 'required',
        message: 'Does the individual pose a risk to children? Select yes or no',
      },
    ],
  },
  poses_risk_to_children_details: {
    dependent: { field: 'poses_risk_to_children', value: 'YES' },
    validate: [
      {
        type: 'required',
        message: 'Enter details of the risk posed to children',
      },
    ],
  },
  violent_offences: {
    validate: [
      {
        type: 'required',
        message: 'Is there a history of violent offences? Select yes or no',
      },
    ],
  },
  violent_offences_details: {
    dependent: { field: 'violent_offences', value: 'YES' },
    validate: [
      {
        type: 'required',
        message: 'Enter details of the violent offences',
      },
    ],
  },
  acquisitive_offending: {
    validate: [
      {
        type: 'required',
        message: 'Is there a history of acquisitive offending? Select yes or no',
      },
    ],
  },
  acquisitive_offending_details: {
    dependent: { field: 'acquisitive_offending', value: 'YES' },
    validate: [
      {
        type: 'required',
        message: 'Enter details of the acquisitive offending',
      },
    ],
  },
  sgo_identifier: {
    validate: [
      {
        type: 'required',
        message: 'Has the individual been involved in serious group offending? Select yes or no',
      },
    ],
  },
  sgo_identifier_details: {
    dependent: { field: 'sgo_identifier', value: 'YES' },
    validate: [
      {
        type: 'required',
        message: 'Enter details of the serious group offending (SGO)',
      },
    ],
  },
  control_issues: {
    validate: [
      {
        type: 'required',
        message: 'Has the individual had control issues or disruptive behaviour? Select yes or no',
      },
    ],
  },
  control_issues_details: {
    dependent: { field: 'control_issues', value: 'YES' },
    validate: [
      {
        type: 'required',
        message: 'Enter details of the control issues or disruptive behaviour',
      },
    ],
  },
  history_of_hate_based_behaviour: {
    validate: [
      {
        type: 'required',
        message: 'Does the individual have a history of hate-based attitudes or behaviours? Select yes or no',
      },
    ],
  },
  history_of_hate_based_behaviour_details: {
    dependent: { field: 'history_of_hate_based_behaviour', value: 'YES' },
    validate: [
      {
        type: 'required',
        message: 'Enter details of the hate-based attitudes or behaviours',
      },
    ],
  },
  high_profile_person: {
    validate: [
      {
        type: 'required',
        message: 'Is the individual vulnerable because they are a high-profile person? Select yes or no',
      },
    ],
  },
  high_profile_person_details: {
    dependent: { field: 'high_profile_person', value: 'YES' },
    validate: [
      {
        type: 'required',
        message: "Enter details of the individual's vulnerabilities",
      },
    ],
  },
  additional_rosh_info: {
    validate: [
      {
        type: 'required',
        message: 'Is there additional risk assessment information relevant to Community Payback? Select yes or no',
      },
    ],
  },
  additional_rosh_info_details: {
    dependent: { field: 'additional_rosh_info', value: 'YES' },
    validate: [
      {
        type: 'required',
        message: 'Enter additional risk assessment information',
      },
    ],
  },
  location_exclusion_criteria: {
    validate: [
      {
        type: 'required',
        message: 'Is the individual’s location restricted by victim exclusion criteria? Select yes or no',
      },
    ],
  },
  location_exclusion_criteria_details: {
    dependent: { field: 'location_exclusion_criteria', value: 'YES' },
    validate: [
      {
        type: 'required',
        message: 'Enter details of the location restrictions due to victim exclusion criteria',
      },
    ],
  },
  restricted_placement: {
    validate: [
      {
        type: 'required',
        message: 'Is close supervision or restricted placement recommended? Select yes or no',
      },
    ],
  },
  restricted_placement_details: {
    dependent: { field: 'restricted_placement', value: 'YES' },
    validate: [
      {
        type: 'required',
        message: 'Enter details of the close supervision or restricted placement recommended',
      },
    ],
  },
  no_female_supervisor: {
    validate: [
      {
        type: 'required',
        message: 'Do you recommend not to place with a female supervisor? Select yes or no',
      },
    ],
  },
  no_female_supervisor_details: {
    dependent: { field: 'no_female_supervisor', value: 'YES' },
    validate: [
      {
        type: 'required',
        message: 'Enter details of why not to place individual with female supervisor',
      },
    ],
  },
  no_male_supervisor: {
    validate: [
      {
        type: 'required',
        message: 'Do you recommend not to place with a male supervisor? Select yes or no',
      },
    ],
  },
  no_male_supervisor_details: {
    dependent: { field: 'no_male_supervisor', value: 'YES' },
    validate: [
      {
        type: 'required',
        message: 'Enter details of why not to place individual with male supervisor',
      },
    ],
  },
  restrictive_orders: {
    validate: [
      {
        type: 'required',
        message: 'Are there restrictive orders? Select yes or no',
      },
    ],
  },
  restrictive_orders_details: {
    dependent: { field: 'restrictive_orders', value: 'YES' },
    validate: [
      {
        type: 'required',
        message: 'Enter details of restrictive orders',
      },
    ],
  },
  risk_management_issues_individual: {
    validate: [
      {
        type: 'required',
        message: 'Are there any risk management issues for an individual placement? Select yes or no',
      },
    ],
  },
  risk_management_issues_individual_details: {
    dependent: { field: 'risk_management_issues_individual', value: 'YES' },
    validate: [
      {
        type: 'required',
        message: 'Enter details of risk management issues for an individual placement',
      },
    ],
  },
  risk_management_issues_supervised_group: {
    validate: [
      {
        type: 'required',
        message: 'Are there any risk management issues if working in a supervised group? Select yes or no',
      },
    ],
  },
  risk_management_issues_supervised_group_details: {
    dependent: { field: 'risk_management_issues_supervised_group', value: 'YES' },
    validate: [
      {
        type: 'required',
        message: 'Enter details of risk management issues if working in a supervised group',
      },
    ],
  },
  alcohol_drug_issues: {
    validate: [
      {
        type: 'required',
        message: 'Are there any alcohol or drug issues with health and safety impact? Select yes or no',
      },
    ],
  },
  alcohol_drug_issues_details: {
    dependent: { field: 'alcohol_drug_issues', value: 'YES' },
    validate: [
      {
        type: 'required',
        message: 'Enter details of alcohol or drug issues with health and safety impact',
      },
    ],
  },
  physical_disability: readOnly,
  physical_disability_details: readOnly,
  learning_disability: readOnly,
  learning_disability_details: readOnly,
  learning_difficulty: readOnly,
  learning_difficulty_details: readOnly,
  mental_health_condition: readOnly,
  mental_health_condition_details: readOnly,
  additional_disabilities: {
    ...requireYesOrNo,
    default: 'NO',
  },
  additional_disabilities_details: {
    dependent: { field: 'additional_disabilities', value: 'YES' },
    ...requireEnterDetails,
  },
  disabilities: {
    ...requireYesOrNo,
    default: 'NO',
  },
  disabilities_details: {
    dependent: { field: 'disabilities', value: 'YES' },
  },
  allergies: requireYesOrNo,
  allergies_details: {
    dependent: { field: 'allergies', value: 'YES' },
    ...requireEnterDetails,
  },
  loss_consciousness: requireYesOrNo,
  loss_consciousness_details: {
    dependent: { field: 'loss_consciousness', value: 'YES' },
    ...requireEnterDetails,
  },
  epilepsy: requireYesOrNo,
  epilepsy_details: {
    dependent: { field: 'epilepsy', value: 'YES' },
    ...requireEnterDetails,
  },
  pregnancy: requireYesOrNo,
  pregnancy_pregnant_details: {
    dependent: { field: 'pregnancy', value: 'PREGNANT' },
    ...requireEnterDetails,
  },
  pregnancy_recently_given_birth_details: {
    dependent: { field: 'pregnancy', value: 'RECENTLY_GIVEN_BIRTH' },
    ...requireEnterDetails,
  },
  other_health_issues: requireYesOrNo,
  other_health_issues_details: {
    dependent: { field: 'other_health_issues', value: 'YES' },
    ...requireEnterDetails,
  },
  gp_first_name: {
    // Deprecated: use gp_name instead
    type: 'multiple',
    answerGroup: 'gp_details',
  },
  gp_family_name: {
    // Deprecated: use gp_name instead
    type: 'multiple',
    answerGroup: 'gp_details',
  },
  gp_name: {
    type: 'multiple',
    answerGroup: 'gp_details',
  },
  gp_practice_name: {
    validate: [{ type: 'required', message: 'GP practice name is required' }],
    type: 'multiple',
    answerGroup: 'gp_details',
  },
  gp_address_building_name: { type: 'multiple', answerGroup: 'gp_details' },
  gp_address_house_number: { type: 'multiple', answerGroup: 'gp_details' },
  gp_address_street_name: {
    type: 'multiple',
    answerGroup: 'gp_details',
  },
  gp_address_district: {
    type: 'multiple',
    answerGroup: 'gp_details',
  },
  gp_address_town_or_city: {
    type: 'multiple',
    answerGroup: 'gp_details',
  },
  gp_address_county: {
    type: 'multiple',
    answerGroup: 'gp_details',
  },
  gp_address_postcode: {
    type: 'multiple',
    answerGroup: 'gp_details',
  },
  gp_phone_number: {
    validate: [{ type: 'required', message: 'Phone number is required' }],
    type: 'multiple',
    answerGroup: 'gp_details',
  },
  gp_details_declined: {},
  travel_information: requireYesOrNo,
  travel_information_details: {
    dependent: { field: 'travel_information', value: 'YES' },
    ...requireEnterDetails,
  },
  driving_licence: {
    dependent: { field: 'travel_information', value: 'YES' },
    ...requireYesOrNo,
  },
  vehicle: {
    dependent: { field: 'travel_information', value: 'YES' },
    ...requireYesOrNo,
  },
  public_transport: {
    dependent: { field: 'travel_information', value: 'YES' },
    ...requireYesOrNo,
  },
  caring_commitments: {},
  caring_commitments_details: {
    dependent: { field: 'caring_commitments', value: 'YES' },
  },
  active_carer_commitments_details: {},
  employment_education: {
    validate: [
      {
        type: 'required',
        message: 'Select an option',
      },
    ],
  },
  employment_education_details_fulltime: {
    dependent: { field: 'employment_education', value: 'FULLTIME_EDUCATION_EMPLOYMENT' },
    ...requireEnterDetails,
  },
  employment_education_details_parttime: {
    dependent: { field: 'employment_education', value: 'PARTTIME_EDUCATION_EMPLOYMENT' },
    ...requireEnterDetails,
  },
  reading_writing_difficulties: requireYesOrNo,
  reading_writing_difficulties_details: {
    dependent: { field: 'reading_writing_difficulties', value: 'YES' },
    ...requireEnterDetails,
  },
  work_skills: requireYesOrNo,
  work_skills_details: {
    dependent: { field: 'work_skills', value: 'YES' },
    ...requireEnterDetails,
  },
  future_work_plans: requireYesOrNo,
  future_work_plans_details: {
    dependent: { field: 'future_work_plans', value: 'YES' },
    ...requireEnterDetails,
  },
  education_training_need: requireYesOrNo,
  education_training_need_details: {
    dependent: { field: 'education_training_need', value: 'YES' },
    ...requireEnterDetails,
  },
  individual_commitment: {
    dependent: { field: 'education_training_need', value: 'YES' },
    ...requireYesOrNo,
  },
  individual_commitment_details: {
    dependent: { field: 'individual_commitment', value: 'NO' },
    ...requireEnterDetails,
  },
  eligibility_intensive_working: {
    validate: [{ type: 'required', message: 'Is the individual eligible for intensive working? Select yes or no' }],
  },
  eligibility_intensive_working_details: {
    dependent: { field: 'eligibility_intensive_working', value: 'NO' },
    validate: [
      {
        type: 'required',
        message: 'Enter details about why the individual is not eligible for intensive working',
      },
    ],
  },
  recommended_hours_start_order: {
    dependent: { field: 'eligibility_intensive_working', value: 'YES' },
    validate: [
      {
        type: 'required',
        message:
          'Enter recommended hours per week in addition to the statutory minimum at the start of the order between 0 and 21',
      },
      {
        fn: noSpace,
        message: 'Enter a number between 0 and 21',
      },
      {
        fn: range,
        arguments: [0, 21],
        message: 'Enter a number between 0 and 21',
      },
    ],
  },
  recommended_hours_midpoint_order: {
    dependent: { field: 'eligibility_intensive_working', value: 'YES' },
    validate: [
      {
        type: 'required',
        message:
          'Enter recommended hours per week in addition to the statutory minimum at the midpoint of the order between 0 and 21',
      },
      {
        fn: noSpace,
        message: 'Enter a number between 0 and 21',
      },
      {
        fn: range,
        arguments: [0, 21],
        message: 'Enter a number between 0 and 21',
      },
    ],
  },
  twenty_eight_hours_working_week_details: {
    dependent: { field: 'eligibility_intensive_working', value: 'YES' },
    validate: [
      {
        type: 'required',
        message: 'Enter details of when the individual should be expected to reach a 28 hour working week',
      },
    ],
  },
  individual_availability: {
    validate: [
      {
        type: 'required',
        message: 'Select when the individual is available for work',
      },
    ],
  },
  individual_availability_details: {},
  male_female_clothing: requireSelectOption,
  waterproof_clothing: requireSelectOption,
  footwear_size: requireSelectOption,
  individual_details_complete: requireSelectOption,
  cultural_religious_adjustment_complete: {
    validate: [
      {
        type: 'required',
        message: 'Select Yes I have completed this section or No I have not completed and will come back later',
      },
    ],
  },
  placement_preference_complete: requireSelectOption,
  placement_preference_by_gender_complete: {
    validate: [
      {
        type: 'required',
        message: 'Select Yes I have completed this section or No I have not completed and will come back later',
      },
    ],
  },
  rosh_community_complete: {
    validate: [
      {
        type: 'required',
        message: 'Select Yes I have completed this section or No I have not completed and will come back later',
      },
    ],
  },
  managing_risk_complete: {
    validate: [
      {
        type: 'required',
        message: 'Select Yes I have completed this section or No I have not completed and will come back later',
      },
    ],
  },
  disabilities_complete: requireSelectOption,
  health_issues_complete: requireSelectOption,
  gp_details_complete: requireSelectOption,
  travel_information_complete: requireSelectOption,
  caring_commitments_complete: requireSelectOption,
  employment_education_skills_complete: requireSelectOption,
  employment_training_complete: requireSelectOption,
  eligibility_intensive_working_complete: requireSelectOption,
  individual_availability_complete: requireSelectOption,
  equipment_complete: requireSelectOption,
}

// const customValidations = (fields, answers) => {
//   return fields
// }

module.exports = {
  fields,
  customValidationsEditEmergencyContact,
  customValidationsEditContactDetails,
  customValidationsCaringCommitments,
}
