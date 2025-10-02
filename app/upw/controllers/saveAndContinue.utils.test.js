import {
  createMultiplesFields,
  migrateGpDetails,
  migrateEmergencyContacts,
  removeOldFields,
} from './saveAndContinue.utils'

describe('gpDetails.utils.js', () => {
  describe('createMultiplesFields', () => {
    it('creates a "gp_details" and "emergency_contact_details" arrays if non exists', () => {
      const answers = {}

      const updatedAnswers = createMultiplesFields(answers)

      expect(updatedAnswers).toEqual({
        gp_details: [],
        emergency_contact_details: [],
      })
    })

    it('does not overwrite "gp_details" and "emergency_contact_details" arrays if they exist', () => {
      const answers = {
        gp_details: [
          {
            gp_name: ['Nick Riviera'],
            gp_practice_name: [''],
            gp_phone_number: ['555-NICK'],
            gp_address_building_name: [''],
            gp_address_house_number: ['44'],
            gp_address_street_name: ['Bow Street'],
            gp_address_district: [''],
            gp_address_town_or_city: ['Springfield'],
            gp_address_county: [''],
            gp_address_postcode: [''],
          },
        ],
        emergency_contact_details: [
          {
            emergency_contact_first_name: ['Peter'],
            emergency_contact_family_name: ['Venkman'],
            emergency_contact_relationship: [''],
            emergency_contact_phone_number: [''],
            emergency_contact_mobile_phone_number: [''],
          },
        ],
      }

      const updatedAnswers = createMultiplesFields(answers)

      expect(updatedAnswers).toEqual(answers)
    })
  })

  describe('migrateGpDetails', () => {
    it('creates a new "gp_details" entry from existing data', () => {
      const answers = {
        gp_first_name: ['Nick'],
        gp_family_name: ['Riviera'],
        gp_phone_number: ['555-NICK'],
        gp_address_building_name: [''],
        gp_address_house_number: ['44'],
        gp_address_street_name: ['Bow Street'],
        gp_address_district: [''],
        gp_address_town_or_city: ['Springfield'],
        gp_address_county: [''],
        gp_address_postcode: [''],
        gp_details: [],
      }

      const updatedAnswers = migrateGpDetails(answers)

      expect(updatedAnswers).toEqual({
        ...answers,
        gp_details: [
          {
            gp_name: ['Nick Riviera'],
            gp_practice_name: [''],
            gp_phone_number: ['555-NICK'],
            gp_address_building_name: [''],
            gp_address_house_number: ['44'],
            gp_address_street_name: ['Bow Street'],
            gp_address_district: [''],
            gp_address_town_or_city: ['Springfield'],
            gp_address_county: [''],
            gp_address_postcode: [''],
          },
        ],
      })
    })

    it('does no create a new "gp_details" entry when source fields are empty', () => {
      const answers = {
        gp_first_name: [''],
        gp_family_name: [''],
        gp_phone_number: [''],
        gp_address_building_name: [''],
        gp_address_house_number: [''],
        gp_address_street_name: [''],
        gp_address_district: [''],
        gp_address_town_or_city: [''],
        gp_address_county: [''],
        gp_address_postcode: [''],
        gp_details: [],
      }

      const updatedAnswers = migrateGpDetails(answers)

      expect(updatedAnswers).toEqual({
        ...answers,
        gp_details: [],
      })
    })

    it('creates another new "gp_details" entry from existing data when they do not match', () => {
      const answers = {
        gp_first_name: ['Nick'],
        gp_family_name: ['Riviera'],
        gp_phone_number: ['555-NICK'],
        gp_address_building_name: [''],
        gp_address_house_number: ['44'],
        gp_address_street_name: ['Bow Street'],
        gp_address_district: [''],
        gp_address_town_or_city: ['Springfield'],
        gp_address_county: [''],
        gp_address_postcode: [''],
        gp_details: [
          {
            gp_name: ['Julius Hibbert'],
            gp_practice_name: ['Marvin Monroe Memorial Hospital'],
            gp_phone_number: [''],
            gp_address_building_name: [''],
            gp_address_house_number: [''],
            gp_address_street_name: [''],
            gp_address_district: [''],
            gp_address_town_or_city: ['Springfield'],
            gp_address_county: [''],
            gp_address_postcode: [''],
          },
        ],
      }

      const updatedAnswers = migrateGpDetails(answers)

      expect(updatedAnswers).toEqual({
        ...answers,
        gp_details: [
          {
            gp_name: ['Julius Hibbert'],
            gp_practice_name: ['Marvin Monroe Memorial Hospital'],
            gp_phone_number: [''],
            gp_address_building_name: [''],
            gp_address_house_number: [''],
            gp_address_street_name: [''],
            gp_address_district: [''],
            gp_address_town_or_city: ['Springfield'],
            gp_address_county: [''],
            gp_address_postcode: [''],
          },
          {
            gp_name: ['Nick Riviera'],
            gp_practice_name: [''],
            gp_phone_number: ['555-NICK'],
            gp_address_building_name: [''],
            gp_address_house_number: ['44'],
            gp_address_street_name: ['Bow Street'],
            gp_address_district: [''],
            gp_address_town_or_city: ['Springfield'],
            gp_address_county: [''],
            gp_address_postcode: [''],
          },
        ],
      })
    })

    it('does not create another new "gp_details" entry from existing data when they do match', () => {
      const answers = {
        gp_first_name: ['Nick'],
        gp_family_name: ['Riviera'],
        gp_phone_number: ['555-NICK'],
        gp_address_building_name: [''],
        gp_address_house_number: ['44'],
        gp_address_street_name: ['Bow Street'],
        gp_address_district: [''],
        gp_address_town_or_city: ['Springfield'],
        gp_address_county: [''],
        gp_address_postcode: [''],
        gp_details: [
          {
            gp_name: ['Nick Riviera'],
            gp_practice_name: [''],
            gp_phone_number: ['555-NICK'],
            gp_address_building_name: [''],
            gp_address_house_number: ['44'],
            gp_address_street_name: ['Bow Street'],
            gp_address_district: [''],
            gp_address_town_or_city: ['Springfield'],
            gp_address_county: [''],
            gp_address_postcode: [''],
          },
        ],
      }

      const updatedAnswers = migrateGpDetails(answers)

      expect(updatedAnswers).toEqual({
        ...answers,
        gp_details: [
          {
            gp_name: ['Nick Riviera'],
            gp_practice_name: [''],
            gp_phone_number: ['555-NICK'],
            gp_address_building_name: [''],
            gp_address_house_number: ['44'],
            gp_address_street_name: ['Bow Street'],
            gp_address_district: [''],
            gp_address_town_or_city: ['Springfield'],
            gp_address_county: [''],
            gp_address_postcode: [''],
          },
        ],
      })
    })
  })
})

describe('migrateEmergencyContacts', () => {
  it('creates a new "emergency_contact_details" entry from existing data', () => {
    const answers = {
      emergency_contact_first_name: ['Peter'],
      emergency_contact_family_name: ['Venkman'],
      emergency_contact_relationship: [''],
      emergency_contact_address_building_name: ['Firehouse'],
      emergency_contact_address_house_number: ['14'],
      emergency_contact_address_street_name: ['North Moore Street'],
      emergency_contact_address_district: ['Manhattan'],
      emergency_contact_address_town_or_city: ['New York'],
      emergency_contact_address_county: [''],
      emergency_contact_phone_number: [''],
      emergency_contact_mobile_phone_number: [''],
      emergency_contact_details: [],
    }

    const updatedAnswers = migrateEmergencyContacts(answers)

    expect(updatedAnswers).toEqual({
      ...answers,
      emergency_contact_details: [
        {
          emergency_contact_first_name: ['Peter'],
          emergency_contact_family_name: ['Venkman'],
          emergency_contact_relationship: [''],
          emergency_contact_phone_number: [''],
          emergency_contact_mobile_phone_number: [''],
        },
      ],
    })
  })

  it('creates a new "emergency_contact_details" entry from existing data', () => {
    const answers = {
      emergency_contact_first_name: [''],
      emergency_contact_family_name: [''],
      emergency_contact_relationship: [''],
      emergency_contact_address_building_name: [''],
      emergency_contact_address_house_number: [''],
      emergency_contact_address_street_name: [''],
      emergency_contact_address_district: [''],
      emergency_contact_address_town_or_city: [''],
      emergency_contact_address_county: [''],
      emergency_contact_phone_number: [''],
      emergency_contact_mobile_phone_number: [''],
      emergency_contact_details: [],
    }

    const updatedAnswers = migrateEmergencyContacts(answers)

    expect(updatedAnswers).toEqual({
      ...answers,
      emergency_contact_details: [],
    })
  })

  it('creates another new "emergency_contact_details" entry from existing data when they do not match', () => {
    const answers = {
      emergency_contact_first_name: ['Peter'],
      emergency_contact_family_name: ['Venkman'],
      emergency_contact_relationship: [''],
      emergency_contact_address_building_name: ['Firehouse'],
      emergency_contact_address_house_number: ['14'],
      emergency_contact_address_street_name: ['North Moore Street'],
      emergency_contact_address_district: ['Manhattan'],
      emergency_contact_address_town_or_city: ['New York'],
      emergency_contact_address_county: [''],
      emergency_contact_phone_number: [''],
      emergency_contact_mobile_phone_number: [''],
      emergency_contact_details: [
        {
          emergency_contact_first_name: ['Winston'],
          emergency_contact_family_name: ['Zeddemore'],
          emergency_contact_relationship: [''],
          emergency_contact_phone_number: [''],
          emergency_contact_mobile_phone_number: [''],
        },
      ],
    }

    const updatedAnswers = migrateEmergencyContacts(answers)

    expect(updatedAnswers).toEqual({
      ...answers,
      emergency_contact_details: [
        {
          emergency_contact_first_name: ['Winston'],
          emergency_contact_family_name: ['Zeddemore'],
          emergency_contact_relationship: [''],
          emergency_contact_phone_number: [''],
          emergency_contact_mobile_phone_number: [''],
        },
        {
          emergency_contact_first_name: ['Peter'],
          emergency_contact_family_name: ['Venkman'],
          emergency_contact_relationship: [''],
          emergency_contact_phone_number: [''],
          emergency_contact_mobile_phone_number: [''],
        },
      ],
    })
  })

  it('does not create another new "emergency_contact_details" entry from existing data when they do match', () => {
    const answers = {
      emergency_contact_first_name: ['Peter'],
      emergency_contact_family_name: ['Venkman'],
      emergency_contact_relationship: [''],
      emergency_contact_address_building_name: ['Firehouse'],
      emergency_contact_address_house_number: ['14'],
      emergency_contact_address_street_name: ['North Moore Street'],
      emergency_contact_address_district: ['Manhattan'],
      emergency_contact_address_town_or_city: ['New York'],
      emergency_contact_address_county: [''],
      emergency_contact_phone_number: [''],
      emergency_contact_mobile_phone_number: [''],
      emergency_contact_details: [
        {
          emergency_contact_first_name: ['Peter'],
          emergency_contact_family_name: ['Venkman'],
          emergency_contact_relationship: [''],
          emergency_contact_phone_number: [''],
          emergency_contact_mobile_phone_number: [''],
        },
      ],
    }

    const updatedAnswers = migrateEmergencyContacts(answers)

    expect(updatedAnswers).toEqual({
      ...answers,
      emergency_contact_details: [
        {
          emergency_contact_first_name: ['Peter'],
          emergency_contact_family_name: ['Venkman'],
          emergency_contact_relationship: [''],
          emergency_contact_phone_number: [''],
          emergency_contact_mobile_phone_number: [''],
        },
      ],
    })
  })
})

describe('removeOldFields', () => {
  it('it removes old fields for "GP Details"', () => {
    const answers = {
      gp_first_name: ['Nick'],
      gp_family_name: ['Riviera'],
      gp_phone_number: ['555-NICK'],
      gp_address_building_name: [''],
      gp_address_house_number: ['44'],
      gp_address_street_name: ['Bow Street'],
      gp_address_district: [''],
      gp_address_town_or_city: ['Springfield'],
      gp_address_county: [''],
      gp_address_postcode: [''],
    }

    const updatedAnswers = removeOldFields(answers)

    expect(updatedAnswers).toEqual({
      gp_first_name: [''],
      gp_family_name: [''],
      gp_phone_number: [''],
      gp_address_building_name: [''],
      gp_address_house_number: [''],
      gp_address_street_name: [''],
      gp_address_district: [''],
      gp_address_town_or_city: [''],
      gp_address_county: [''],
      gp_address_postcode: [''],
    })
  })

  it('it removes old fields for "Emergency Contacts"', () => {
    const answers = {
      emergency_contact_first_name: ['Peter'],
      emergency_contact_family_name: ['Venkman'],
      emergency_contact_relationship: [''],
      emergency_contact_address_building_name: ['Firehouse'],
      emergency_contact_address_house_number: ['14'],
      emergency_contact_address_street_name: ['North Moore Street'],
      emergency_contact_address_district: ['Manhattan'],
      emergency_contact_address_town_or_city: ['New York'],
      emergency_contact_address_county: [''],
      emergency_contact_phone_number: [''],
      emergency_contact_mobile_phone_number: [''],
    }

    const updatedAnswers = removeOldFields(answers)

    expect(updatedAnswers).toEqual({
      emergency_contact_first_name: [''],
      emergency_contact_family_name: [''],
      emergency_contact_relationship: [''],
      emergency_contact_address_building_name: [''],
      emergency_contact_address_house_number: [''],
      emergency_contact_address_street_name: [''],
      emergency_contact_address_district: [''],
      emergency_contact_address_town_or_city: [''],
      emergency_contact_address_county: [''],
      emergency_contact_phone_number: [''],
      emergency_contact_mobile_phone_number: [''],
    })
  })

  it('only removes fields it is configured to remove', () => {
    const answers = {
      some_field: ['Some value'],
      some_collection: [{ some_field: ['Some value'] }],
    }

    const updatedAnswers = removeOldFields(answers)

    expect(updatedAnswers).toEqual(answers)
  })
})
