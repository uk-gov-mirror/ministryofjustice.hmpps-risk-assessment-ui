const { addSectionCompleteField } = require('./utils')

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
      type: 'required',
      message: 'Enter details',
    },
  ],
}

const readOnly = { readOnly: true }

let fields = {
  declaration: {
    questionText: '[PLACEHOLDER]',
    questionCode: 'declaration',
    answerType: 'checkbox',
    answerSchemas: [{ text: 'Complete', value: 'COMPLETE' }],
  },
  upw_cultural_religious_adjustment: requireYesOrNo,
  upw_cultural_religious_adjustment_details: {
    dependent: { field: 'upw_cultural_religious_adjustment', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_placement_preference: requireYesOrNo,
  upw_placement_preferences: {
    dependent: { field: 'upw_placement_preference', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_placement_preference_by_gender_details: {
    ...requireEnterDetails,
  },
  upw_history_sexual_offending: requireYesOrNo,
  upw_history_sexual_offending_details: {
    dependent: { field: 'upw_history_sexual_offending', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_poses_risk_to_children: requireYesOrNo,
  upw_poses_risk_to_children_details: {
    dependent: { field: 'upw_poses_risk_to_children', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_violent_offences: requireYesOrNo,
  upw_violent_offences_details: {
    dependent: { field: 'upw_violent_offences', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_acquisitive_offending: requireYesOrNo,
  upw_acquisitive_offending_details: {
    dependent: { field: 'upw_acquisitive_offending', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_sgo_identifier: requireYesOrNo,
  upw_sgo_identifier_details: {
    dependent: { field: 'upw_sgo_identifier', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_control_issues: requireYesOrNo,
  upw_control_issues_details: {
    dependent: { field: 'upw_control_issues', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_hate_based_behaviour: requireYesOrNo,
  upw_hate_based_behaviour_details: {
    dependent: { field: 'upw_hate_based_behaviour', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_high_profile_person: requireYesOrNo,
  upw_high_profile_person_details: {
    dependent: { field: 'upw_high_profile_person', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_additional_rosh_info: requireYesOrNo,
  upw_additional_rosh_info_details: {
    dependent: { field: 'upw_additional_rosh_info', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_location_exclusion_criteria: requireYesOrNo,
  upw_location_exclusion_criteria_details: {
    dependent: { field: 'upw_location_exclusion_criteria', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_restricted_placement: requireYesOrNo,
  upw_restricted_placement_details: {
    dependent: { field: 'upw_restricted_placement', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_no_female_supervisor: requireYesOrNo,
  upw_no_female_supervisor_details: {
    dependent: { field: 'upw_no_female_supervisor', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_no_male_supervisor: requireYesOrNo,
  upw_no_male_supervisor_details: {
    dependent: { field: 'upw_no_male_supervisor', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_restrictive_orders: requireYesOrNo,
  upw_restrictive_orders_details: {
    dependent: { field: 'upw_restrictive_orders', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_risk_management_issues_individual: requireYesOrNo,
  upw_risk_management_issues_individual_details: {
    dependent: { field: 'upw_risk_management_issues_individual', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_risk_management_issues_supervised_group: requireYesOrNo,
  upw_risk_management_issues_supervised_group_details: {
    dependent: { field: 'upw_risk_management_issues_supervised_group', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_alcohol_drug_issues: requireYesOrNo,
  upw_alcohol_drug_issues_details: {
    dependent: { field: 'upw_alcohol_drug_issues', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_physical_disability: readOnly,
  upw_physical_disability_details: readOnly,
  upw_learning_disability: readOnly,
  upw_learning_disability_details: readOnly,
  upw_learning_difficulty: readOnly,
  upw_learning_difficulty_details: readOnly,
  upw_mental_health_condition: readOnly,
  upw_mental_health_condition_details: readOnly,
  upw_disabilities: requireYesOrNo,
  upw_disabilities_details: {
    dependent: { field: 'upw_disabilities', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_allergies: requireYesOrNo,
  upw_allergies_details: {
    dependent: { field: 'upw_allergies', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_loss_consciousness: requireYesOrNo,
  upw_loss_consciousness_details: {
    dependent: { field: 'upw_loss_consciousness', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_epilepsy: requireYesOrNo,
  upw_epilepsy_details: {
    dependent: { field: 'upw_epilepsy', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_other_health_issues: requireYesOrNo,
  upw_other_health_issues_details: {
    dependent: { field: 'upw_other_health_issues', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_pregnancy: requireYesOrNo,
  upw_pregnancy_details: {
    dependent: { field: 'upw_pregnancy', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_gp_name: {
    validate: [{ type: 'required', message: 'Name is required' }],
  },
  upw_gp_address_building_name: {
    validate: [{ type: 'required', message: 'Building name is required' }],
  },
  upw_gp_address_house_number: {
    validate: [{ type: 'required', message: 'House number is required' }],
  },
  upw_gp_address_street_name: {
    validate: [{ type: 'required', message: 'Street name is required' }],
  },
  upw_gp_address_district: {
    validate: [{ type: 'required', message: 'District is required' }],
  },
  upw_gp_address_town_or_city: {
    validate: [{ type: 'required', message: 'Town/City is required' }],
  },
  upw_gp_address_county: {
    validate: [{ type: 'required', message: 'County is required' }],
  },
  upw_gp_address_postcode: {
    validate: [{ type: 'required', message: 'Postcode is required' }],
  },
  upw_gp_phone_number: {
    validate: [{ type: 'required', message: 'Phone number is required' }],
  },
  upw_travel_information: requireYesOrNo,
  upw_travel_information_details: {
    dependent: { field: 'upw_travel_information', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_driving_licence: {
    dependent: { field: 'upw_travel_information', value: 'YES' },
    ...requireYesOrNo,
  },
  upw_vehicle: {
    dependent: { field: 'upw_travel_information', value: 'YES' },
    ...requireYesOrNo,
  },
  upw_public_transport: {
    dependent: { field: 'upw_travel_information', value: 'YES' },
    ...requireYesOrNo,
  },
  upw_caring_commitments: requireYesOrNo,
  upw_caring_commitments_details: {
    dependent: { field: 'upw_caring_commitments', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_employment_education: {
    validate: [
      {
        type: 'required',
        message: 'Select an option',
      },
    ],
  },
  upw_employment_education_details_fulltime: {
    dependent: { field: 'upw_employment_education', value: 'FULLTIME_EDUCATION_EMPLOYMENT' },
    ...requireEnterDetails,
  },
  upw_employment_education_details_parttime: {
    dependent: { field: 'upw_employment_education', value: 'PARTTIME_EDUCATION_EMPLOYMENT' },
    ...requireEnterDetails,
  },
  upw_reading_writing_difficulties: requireYesOrNo,
  upw_reading_writing_difficulties_details: {
    dependent: { field: 'upw_reading_writing_difficulties', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_work_skills: requireYesOrNo,
  upw_work_skills_details: {
    dependent: { field: 'upw_work_skills', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_future_work_plans: requireYesOrNo,
  upw_future_work_plans_details: {
    dependent: { field: 'upw_future_work_plans', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_education_training_need: requireYesOrNo,
  upw_education_training_need_details: {
    dependent: { field: 'upw_education_training_need', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_individual_commitment: {
    dependent: { field: 'upw_education_training_need', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_individual_commitment_details: {
    dependent: { field: 'upw_individual_commitment', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_eligibility_intensive_working: requireYesOrNo,
  upw_eligibility_intensive_working_details: {
    dependent: { field: 'upw_eligibility_intensive_working', value: 'NO' },
    ...requireEnterDetails,
  },
  upw_recommended_hours_start_order: {
    dependent: { field: 'upw_eligibility_intensive_working', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_recommended_hours_midpoint_order: {
    dependent: { field: 'upw_eligibility_intensive_working', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_twenty_eight_hours_working_week_details: {
    dependent: { field: 'upw_eligibility_intensive_working', value: 'YES' },
    ...requireEnterDetails,
  },
  upw_individual_availability: requireSelectOption,
  upw_individual_availability_details: {},
  upw_male_female_clothing: requireSelectOption,
  upw_waterproof_clothing: requireSelectOption,
  upw_footwear_size: requireSelectOption,
}

Array.from([
  'individuals-details',
  'cultural-and-religious-adjustments',
  'placement-preferences',
  'options-gender-identity',
  'risk-of-harm-in-the-community',
  'managing-risk',
  'disabilities-and-mental-health',
  'gp-details',
  'health-issues',
  'travel-information',
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
