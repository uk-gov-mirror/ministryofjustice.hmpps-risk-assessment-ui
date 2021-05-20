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
      session: {},
    }
    getJwtToken.mockReturnValueOnce(mockJwtToken)
  })
  afterEach(() => {
    getJwtToken.mockReset()
  })

  test('should add authorisation token to req.tokens and session', async done => {
    await createCredentials(req, res, done)
    expect(getJwtToken).toHaveBeenCalled()
    expect(req.session.token).toEqual(mockJwtToken.access_token)
    expect(req.tokens).toEqual({ authorisationToken: mockJwtToken.access_token })
  })

  test('should set defaults if items are not present in session', async () => {
    await createCredentials(req, res, () => {})
    expect(getJwtToken).toHaveBeenCalled()
    expect(req.session.token).toEqual(mockJwtToken.access_token)
    expect(req.tokens).toEqual({ authorisationToken: `${mockJwtToken.access_token}` })
  })

  test('should not get token if expiry not passed', async done => {
    const tokenValue = 'sometoken'
    req.session.token = tokenValue
    req.session.expires = Date.now() + 5000
    await createCredentials(req, res, done)
    expect(getJwtToken).not.toHaveBeenCalled()
    expect(req.session.token).toEqual(tokenValue)
    expect(req.tokens).toEqual({ authorisationToken: tokenValue })
  })

  test('should get token if expiry is passed', async done => {
    req.session.token = 'sometoken'
    req.session.expires = Date.now() - 5000
    await createCredentials(req, res, done)
    expect(getJwtToken).toHaveBeenCalled()
    expect(req.session.token).toEqual(mockJwtToken.access_token)
    expect(req.tokens).toEqual({ authorisationToken: mockJwtToken.access_token })
  })
})
