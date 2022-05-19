const { convertGpDetails, convertGpDetailsEntries, unsetOldGPDetailsFields } = require('./gpDetails.utils')

const GP_FIRST_NAME = 'first'
const GP_FAMILY_NAME = 'last'
const GP_NAME = `${GP_FIRST_NAME} ${GP_FAMILY_NAME}`

describe('gpDetails.utils.js', () => {
  describe('convertGpDetailsEntries', () => {
    it('formats all records in "gp_details"', () => {
      const originalAnswers = {
        gp_details: [
          { gp_first_name: [GP_FIRST_NAME], gp_family_name: [GP_FAMILY_NAME] },
          { gp_first_name: [GP_FIRST_NAME], gp_family_name: [GP_FAMILY_NAME] },
        ],
      }

      const updatedAnswers = convertGpDetailsEntries(originalAnswers)

      expect(updatedAnswers).toEqual({
        gp_details: [
          { gp_name: [GP_NAME], gp_first_name: [GP_FIRST_NAME], gp_family_name: [GP_FAMILY_NAME] },
          { gp_name: [GP_NAME], gp_first_name: [GP_FIRST_NAME], gp_family_name: [GP_FAMILY_NAME] },
        ],
      })
    })

    it('handles when "gp_details" is unset', () => {
      const originalAnswers = {}

      const updatedAnswers = convertGpDetailsEntries(originalAnswers)

      expect(updatedAnswers).toEqual({ gp_details: [] })
    })
  })

  describe('convertGpDetails', () => {
    it('combines "gp_first_name" and "gp_family_name" in to a single field', () => {
      const originalAnswers = {
        gp_first_name: [GP_FIRST_NAME],
        gp_family_name: [GP_FAMILY_NAME],
      }

      const updatedAnswers = convertGpDetails(originalAnswers)

      expect(updatedAnswers).toEqual({
        gp_name: [GP_NAME],
        gp_first_name: [GP_FIRST_NAME],
        gp_family_name: [GP_FAMILY_NAME],
      })
    })

    it('formats correctly when the "gp_first_name" is missing', () => {
      const originalAnswers = {
        gp_first_name: [],
        gp_family_name: [GP_FAMILY_NAME],
      }

      const updatedAnswers = convertGpDetails(originalAnswers)

      expect(updatedAnswers).toEqual({
        gp_name: [GP_FAMILY_NAME],
        gp_first_name: [],
        gp_family_name: [GP_FAMILY_NAME],
      })
    })

    it('formats correctly when the "gp_family_name" is missing', () => {
      const originalAnswers = {
        gp_first_name: [GP_FIRST_NAME],
        gp_family_name: [],
      }

      const updatedAnswers = convertGpDetails(originalAnswers)

      expect(updatedAnswers).toEqual({
        gp_name: [GP_FIRST_NAME],
        gp_first_name: [GP_FIRST_NAME],
        gp_family_name: [],
      })
    })

    it('formats correctly when both "gp_first_name" and "gp_family_name" are missing', () => {
      const originalAnswers = {
        gp_first_name: [],
        gp_family_name: [],
      }

      const updatedAnswers = convertGpDetails(originalAnswers)

      expect(updatedAnswers).toEqual({
        gp_name: [''],
        gp_first_name: [],
        gp_family_name: [],
      })
    })

    it('returns answers for other answers unchanged', () => {
      const originalAnswers = {
        other_field: ['test'],
      }

      const updatedAnswers = convertGpDetails(originalAnswers)

      expect(updatedAnswers).toEqual({
        other_field: ['test'],
        gp_name: [''],
      })
    })
  })

  describe('unsetOldGPDetailsFields', () => {
    it('will unset the "gp_first_name" field', () => {
      const originalAnswers = {
        gp_first_name: [GP_FIRST_NAME],
      }

      const updatedAnswers = unsetOldGPDetailsFields(originalAnswers)

      expect(updatedAnswers).toEqual({
        gp_details: [],
        gp_first_name: [],
        gp_family_name: [],
      })
    })
    it('will unset the "gp_family_name" field', () => {
      const originalAnswers = {
        gp_family_name: [GP_FAMILY_NAME],
      }

      const updatedAnswers = unsetOldGPDetailsFields(originalAnswers)

      expect(updatedAnswers).toEqual({
        gp_details: [],
        gp_first_name: [],
        gp_family_name: [],
      })
    })

    it('will unset "gp_first_name" and "gp_family_name" for entries in "gp_details"', () => {
      const originalAnswers = {
        gp_details: [
          {
            gp_first_name: [GP_FIRST_NAME],
            gp_family_name: [GP_FAMILY_NAME],
          },
        ],
      }

      const updatedAnswers = unsetOldGPDetailsFields(originalAnswers)

      expect(updatedAnswers).toEqual({
        gp_first_name: [],
        gp_family_name: [],
        gp_details: [
          {
            gp_first_name: [],
            gp_family_name: [],
          },
        ],
      })
    })

    it('return answers for other questions unchanged', () => {
      const originalAnswers = {
        other_field: ['test'],
      }

      const updatedAnswers = unsetOldGPDetailsFields(originalAnswers)

      expect(updatedAnswers).toEqual({
        gp_details: [],
        gp_first_name: [],
        gp_family_name: [],
        other_field: ['test'],
      })
    })
  })
})
