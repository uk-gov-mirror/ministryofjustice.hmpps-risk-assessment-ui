// Local dependencies
const createCredentials = require('./createCredentials')
const { getJwtToken } = require('../data/oauth')
const mockJwtToken = require('./testSupportFiles/mock_jwt_token.json')

jest.mock('../data/oauth')

describe('Put keycloak header information and OASys session key into token object', () => {
  let req
  let res
  beforeEach(() => {
    req = {
      headers: {
        'x-auth-token': 'THX1138',
      },
    }
  })
  afterEach(() => {
    getJwtToken.mockReset()
  })

  test('should add authorisation token to tokens object', async done => {
    await createCredentials(req, res, done)
    expect(req.tokens).toEqual({ authorisationToken: 'THX1138' })
  })

  test('should set defaults if items are not present in headers or session', async () => {
    getJwtToken.mockReturnValueOnce(mockJwtToken)
    req.headers = {}
    await createCredentials(req, res, () => {})
    expect(req.tokens).toEqual({ authorisationToken: `${mockJwtToken.access_token}` })
  })
})
