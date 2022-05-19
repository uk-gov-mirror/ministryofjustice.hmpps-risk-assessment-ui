// used to convert the structure of answers from the old format to the new one for assessments in progress
const _ = require('lodash')
const { postAnswers } = require('../data/hmppsAssessmentApi')
const { logger } = require('../logging/logger')

const gpDetailsFields = [
  'gp_first_name',
  'gp_family_name',
  'gp_address_building_name',
  'gp_address_district',
  'gp_phone_number',
]
const gpDetailsPreviousFormatFields = [
  'gp_first_name',
  'gp_family_name',
  'gp_address_building_name',
  'gp_address_house_number',
  'gp_address_street_name',
  'gp_address_district',
  'gp_address_town_or_city',
  'gp_address_county',
  'gp_address_postcode',
  'gp_phone_number',
]

const emergencyContactsFields = [
  'emergency_contact_first_name',
  'emergency_contact_family_name',
  'emergency_contact_relationship',
  'emergency_contact_phone_number',
  'emergency_contact_mobile_phone_number',
]
const emergencyContactsPreviousFormatFields = [
  'emergency_contact_first_name',
  'emergency_contact_family_name',
  'emergency_contact_relationship',
  'emergency_contact_address_building_name',
  'emergency_contact_address_house_number',
  'emergency_contact_address_street_name',
  'emergency_contact_address_district',
  'emergency_contact_address_town_or_city',
  'emergency_contact_address_county',
  'emergency_contact_address_postcode',
  'emergency_contact_phone_number',
  'emergency_contact_mobile_phone_number',
  'individual_details_complete',
]

const oldFormatPresent = (answers, dataStructure) => {
  let foundOldFormat = false
  dataStructure.forEach(field => {
    if (answers[field]) {
      foundOldFormat = true
    }
  })
  return foundOldFormat
}

const checkAndConvert = (answers, oldStructure, newStructure, itemGrouping) => {
  const transformedAnswers = answers

  if (oldFormatPresent(answers, oldStructure)) {
    const newItem = {}
    newStructure.forEach(field => {
      if (answers[field]) {
        newItem[field] = answers[field]
      }
    })

    transformedAnswers[itemGrouping] = [newItem]

    // remove old answers
    oldStructure.forEach(field => {
      delete transformedAnswers[field]
    })
  }
  return transformedAnswers
}

const convertAnswersStructure = async (answers, assessmentId, episodeId, authorisationToken, userId) => {
  let newAnswers = { ...answers }

  // check and convert gp details
  newAnswers = checkAndConvert(newAnswers, gpDetailsPreviousFormatFields, gpDetailsFields, 'gp_details')

  // check and convert emergency contacts
  newAnswers = checkAndConvert(
    newAnswers,
    emergencyContactsPreviousFormatFields,
    emergencyContactsFields,
    'emergency_contacts',
  )

  // save if necessary
  if (!_.isEqual(newAnswers, answers)) {
    logger.info(`convertAnswersStructure: saving new answers for assessment ${assessmentId}, episode ${episodeId}`)
    try {
      await postAnswers(assessmentId, episodeId, { answers: newAnswers }, authorisationToken, userId)
    } catch (error) {
      logger.error(`Could not save converted answers for assessment ${assessmentId}, current episode, error: ${error}`)
    }
  }
  return newAnswers
}

module.exports = { convertAnswersStructure }
