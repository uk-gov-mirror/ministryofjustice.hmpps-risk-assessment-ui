const nock = require('nock')

const userDetails = {
  isActive: true,
  oasysUserCode: 'SUPPORT1',
  username: 'Ray Arnold',
  email: 'foo@bar.baz',
  areaCode: 'HFS',
  areaName: 'Hertfordshire',
}

jest.mock('../utils/util', () => ({
  getCorrelationId: jest.fn(() => 'mocked-correlation-id'),
}))
jest.mock('./userDetailsCache', () => ({
  getCachedUserDetails: jest.fn(() => userDetails),
}))

const {
  apis: {
    hmppsAssessments: { url },
  },
} = require('../config')
const { getOffenderData } = require('./hmppsAssessmentApi')

describe('hmppsAssessmentApi', () => {
  beforeEach(() => {
    mockedEndpoint = nock(url)
  })
  afterEach(() => {
    nock.cleanAll()
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
})
