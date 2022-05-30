const nock = require('nock')

const userDetails = {
  isActive: true,
  oasysUserCode: 'SUPPORT1',
  username: 'Ray Arnold',
  email: 'foo@bar.baz',
  areaCode: 'HFS',
  areaName: 'Hertfordshire',
}

const { getCorrelationId } = require('../utils/util')

jest.mock('../utils/util')
jest.mock('./userDetailsCache', () => ({
  getCachedUserDetails: jest.fn(() => userDetails),
}))

const {
  apis: {
    hmppsAssessments: { url },
  },
} = require('../config')
const { getOffenderData, postAnswers, getAnswers } = require('./hmppsAssessmentApi')

jest.mock('./hmppsAssessmentApi', () => ({
  ...jest.requireActual('./hmppsAssessmentApi'),
  postAnswers: jest.fn(),
}))

describe('hmppsAssessmentApi', () => {
  beforeEach(() => {
    mockedEndpoint = nock(url)
    getCorrelationId.mockReturnValue('mocked-correlation-id')
  })
  afterEach(() => {
    nock.cleanAll()
    jest.resetAllMocks()
  })
  let mockedEndpoint
  const authorisationToken = 'mytoken'
  const userId = '1234'
  const uuid = '1be1c40e-07d4-4842-8447-6cd2bfffa3bd'

  describe('getOffenderData', () => {
    const offenderDataUrl = `/assessments/${uuid}/subject`
    it('should return offender details from api', async () => {
      const offenderData = {
        pnc: '11032',
        name: 'Bernard Shakey',
        crn: 'S000001',
        age: '23',
        dob: '1989-02-02T00:00:00.000Z',
      }
      mockedEndpoint.get(offenderDataUrl).reply(200, offenderData)
      const output = await getOffenderData(uuid, authorisationToken, userId)
      expect(output).toEqual(offenderData)
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.get(offenderDataUrl).reply(503)
      await expect(getOffenderData(uuid, authorisationToken, userId)).rejects.toThrowError()
    })
  })

  describe('getAnswers', () => {
    const answersUrl = `/assessments/${uuid}/episodes/${uuid}`
    const answersData = {
      otherfield: 'otherfield',
      answers: {
        question_1: ['answer_1'],
        emergency_contact_phone_number: ['987654321'],
        question_2: ['answer_2'],
        gp_family_name: ['Smith'],
        gp_phone_number: ['0123456789'],
        emergency_contact_family_name: ['West'],
      },
    }
    it('should return answer details from api', async () => {
      mockedEndpoint.get(answersUrl).reply(200, answersData)
      const output = await getAnswers(uuid, uuid, authorisationToken, userId)
      expect(output).toEqual(answersData)
      expect(postAnswers).not.toHaveBeenCalled()
    })
  })
})
