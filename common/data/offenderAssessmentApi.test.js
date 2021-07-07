const nock = require('nock')

jest.mock('../utils/util', () => ({
  getCorrelationId: jest.fn(() => 'mocked-correlation-id'),
}))

const {
  apis: {
    offenderAssessments: { url },
  },
} = require('../config')
const { getUserProfile } = require('./offenderAssessmentApi')

describe('hmppsAssessmentApi', () => {
  beforeEach(() => {
    mockedEndpoint = nock(url)
  })
  afterEach(() => {
    nock.cleanAll()
  })
  let mockedEndpoint
  const authorisationToken = 'mytoken'
  const userCode = 'SUPPORT1'

  describe('getUserProfile', () => {
    const offenderDataUrl = `/authentication/user/${userCode}`
    it('should return offender details from api', async () => {
      const offenderData = {
        pnc: '11032',
        name: 'Bernard Shakey',
        crn: 'S000001',
        age: '23',
        dob: '1989-02-02T00:00:00.000Z',
      }
      mockedEndpoint.get(offenderDataUrl).reply(200, offenderData)
      const output = await getUserProfile(userCode, authorisationToken)
      expect(output).toEqual(offenderData)
    })
    it('should throw an error if it does not receive a valid response', async () => {
      mockedEndpoint.get(offenderDataUrl).reply(503)
      await expect(getUserProfile(userCode, authorisationToken)).rejects.toThrowError(
        'We are working to fix it as quickly as possible',
      )
    })
  })
})
