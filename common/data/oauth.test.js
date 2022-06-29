const nock = require('nock')
const { AuthenticationError } = require('../utils/errors')
const { getApiToken, getUserEmail, checkTokenIsActive } = require('./oauth')
const redis = require('./redis')

jest.mock('../config', () => ({
  applicationInsights: { disabled: true },
  apiClientId: 'foo',
  apiClientSecret: 'bar',
  apis: {
    oauth: { timeout: 10000, url: 'http://hmpps-auth.mock' },
  },
}))

jest.mock('../data/redis', () => ({
  get: jest.fn(),
  set: jest.fn(),
}))

describe('Oauth', () => {
  let authService

  beforeEach(() => {
    authService = nock('http://hmpps-auth.mock')
  })

  afterEach(() => {
    nock.abortPendingRequests()
    nock.cleanAll()
  })

  describe('checkTokenIsActive', () => {
    it('returns the token status', async () => {
      authService.post('/token/verify').matchHeader('authorization', 'Bearer FOO_TOKEN').reply(200, { active: true })

      const isActive = await checkTokenIsActive('FOO_TOKEN')

      expect(isActive).toEqual(true)
    })

    it('swallows exceptions', async () => {
      authService.get('/token/verify').matchHeader('authorization', 'Bearer FOO_TOKEN').reply(500)

      const isActive = await checkTokenIsActive('FOO_TOKEN')

      expect(isActive).toEqual(undefined)
    })
  })

  describe('getUserEmail', () => {
    it('returns the user email', async () => {
      authService
        .get('/api/me/email')
        .matchHeader('authorization', 'Bearer FOO_TOKEN')
        .reply(200, { email: 'foo@bar.baz' })

      const email = await getUserEmail('FOO_TOKEN')

      expect(email).toEqual('foo@bar.baz')
    })

    it('Throws AuthenticationError when unable to find user', async () => {
      authService.get('/api/me/email').matchHeader('authorization', 'Bearer FOO_TOKEN').reply(404)

      await expect(getUserEmail('FOO_TOKEN')).rejects.toThrow(new AuthenticationError('Unable to fetch user details'))
    })
  })

  describe('getApiToken', () => {
    it('returns the token if found in cache', async () => {
      authService
        .post('/oauth/token?grant_type=client_credentials')
        .matchHeader('authorization', 'Basic Zm9vOmJhcg==')
        .reply(200, { access_token: 'FOO_TOKEN', expires_in: 12345 })

      redis.get.mockResolvedValue('CACHED_TOKEN')

      const token = await getApiToken()
      expect(token).toEqual('CACHED_TOKEN')
    })

    it('fetches a new token if not found in cache', async () => {
      authService
        .post('/oauth/token?grant_type=client_credentials')
        .matchHeader('authorization', 'Basic Zm9vOmJhcg==')
        .reply(200, { access_token: 'FOO_TOKEN', expires_in: 12345 })

      redis.get.mockResolvedValue()

      const token = await getApiToken()
      expect(token).toEqual('FOO_TOKEN')
    })
  })
})
