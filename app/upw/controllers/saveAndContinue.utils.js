const createFullNameFrom = (firstName = '', familyName = '') => `${firstName} ${familyName}`.trim()
const orEmptyWith = (answers, defaultValue = []) => questionCode => answers[questionCode] || defaultValue
const answersExistIn = answers => questionCode =>
  Array.isArray(answers[questionCode]) && answers[questionCode].some(value => value !== '')

const gpDetailsMigration = {
  collectionKey: 'gp_details',
  recordFrom(answers) {
    const getAnswerOrEmpty = orEmptyWith(answers, [''])
    return {
      gp_name: answers.gp_name || [createFullNameFrom(answers.gp_first_name, answers.gp_family_name)],
      gp_practice_name: getAnswerOrEmpty('gp_practice_name'),
      gp_address_building_name: getAnswerOrEmpty('gp_address_building_name'),
      gp_address_house_number: getAnswerOrEmpty('gp_address_house_number'),
      gp_address_street_name: getAnswerOrEmpty('gp_address_street_name'),
      gp_address_district: getAnswerOrEmpty('gp_address_district'),
      gp_address_town_or_city: getAnswerOrEmpty('gp_address_town_or_city'),
      gp_address_county: getAnswerOrEmpty('gp_address_county'),
      gp_address_postcode: getAnswerOrEmpty('gp_address_postcode'),
      gp_phone_number: getAnswerOrEmpty('gp_phone_number'),
    }
  },
  hasFieldsToBeConverted(answers = {}) {
    return [
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
    ].some(answersExistIn(answers))
  },
}

const emergencyContactsMigration = {
  collectionKey: 'emergency_contact_details',
  recordFrom(answers) {
    const getAnswerOrEmpty = orEmptyWith(answers, [''])
    return {
      emergency_contact_first_name: getAnswerOrEmpty('emergency_contact_first_name'),
      emergency_contact_family_name: getAnswerOrEmpty('emergency_contact_family_name'),
      emergency_contact_relationship: getAnswerOrEmpty('emergency_contact_relationship'),
      emergency_contact_phone_number: getAnswerOrEmpty('emergency_contact_phone_number'),
      emergency_contact_mobile_phone_number: getAnswerOrEmpty('emergency_contact_mobile_phone_number'),
    }
  },
  hasFieldsToBeConverted(answers = {}) {
    return [
      'emergency_contact_first_name',
      'emergency_contact_family_name',
      'emergency_contact_relationship',
      'emergency_contact_phone_number',
      'emergency_contact_mobile_phone_number',
    ].some(answersExistIn(answers))
  },
}

const fieldsToRemove = [
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
]

const createMultiplesFields = answers => {
  const getExistingEntriesFor = orEmptyWith(answers)
  return {
    ...answers,
    gp_details: getExistingEntriesFor('gp_details'),
    emergency_contact_details: getExistingEntriesFor('emergency_contact_details'),
  }
}

const migrateFieldsUsing = (migration = {}) => originalAnswers => {
  const { collectionKey, recordFrom, hasFieldsToBeConverted } = migration

  if (!collectionKey || !recordFrom || !hasFieldsToBeConverted) {
    throw new Error('Misconfigured migration')
  }

  const answers = { ...originalAnswers, [collectionKey]: originalAnswers[collectionKey].map(recordFrom) }
  if (hasFieldsToBeConverted(answers)) {
    const recordToBeAdded = recordFrom(answers)
    if (
      !answers[collectionKey].some(existingRecord => JSON.stringify(recordToBeAdded) === JSON.stringify(existingRecord))
    ) {
      answers[collectionKey].push(recordToBeAdded)
    }
  }

  return answers
}

const safeDelete = fields => answers => {
  const updatedAnswers = { ...answers }
  fields.forEach(id => {
    if (updatedAnswers[id]) {
      delete updatedAnswers[id]
    }
  })
  return updatedAnswers
}

const migrateGpDetails = migrateFieldsUsing(gpDetailsMigration)
const migrateEmergencyContacts = migrateFieldsUsing(emergencyContactsMigration)
const removeOldFields = safeDelete(fieldsToRemove)

module.exports = {
  createMultiplesFields,
  migrateGpDetails,
  migrateEmergencyContacts,
  removeOldFields,
}
