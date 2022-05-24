const { convertAnswersStructure } = require('./convertAnswersStructure')

jest.mock('../logging/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}))

const assessmentUuid = 'assessment-uuid'
const episodeId = 'episode-uuid'
const authorisationToken = 'authorisation-token'
const userId = 'user-uuid'

describe('converts answer structure', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('returns unchanged input when no changes are necessary', async () => {
    const answers = {
      question_1: ['answer_1'],
      question_2: ['answer_2'],
    }

    const result = await convertAnswersStructure(answers, assessmentUuid, episodeId, authorisationToken, userId)
    expect(result).toEqual(answers)
  })

  it('converts structure when it finds a target field', async () => {
    const answers = {
      question_1: ['answer_1'],
      question_2: ['answer_2'],
      gp_family_name: ['smith'],
      gp_phone_number: ['0123456789'],
    }
    const expected = {
      question_1: ['answer_1'],
      question_2: ['answer_2'],
      gp_details: [
        {
          gp_family_name: ['smith'],
          gp_phone_number: ['0123456789'],
        },
      ],
    }
    const result = await convertAnswersStructure(answers, assessmentUuid, episodeId, authorisationToken, userId)
    expect(result).toEqual(expected)
  })
  it('converts multiple structures when it finds target fields', async () => {
    const answers = {
      question_1: ['answer_1'],
      emergency_contact_phone_number: ['987654321'],
      question_2: ['answer_2'],
      gp_family_name: ['Smith'],
      gp_phone_number: ['0123456789'],
      emergency_contact_family_name: ['West'],
    }
    const expected = {
      emergency_contacts: [
        {
          emergency_contact_family_name: ['West'],
          emergency_contact_phone_number: ['987654321'],
        },
      ],
      gp_details: [
        {
          gp_family_name: ['Smith'],
          gp_phone_number: ['0123456789'],
        },
      ],
      question_1: ['answer_1'],
      question_2: ['answer_2'],
    }
    const result = await convertAnswersStructure(answers, assessmentUuid, episodeId, authorisationToken, userId)
    expect(result).toEqual(expected)
  })
})
