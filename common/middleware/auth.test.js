const refresh = require('passport-oauth2-refresh')
const passport = require('passport')
const auth = require('./auth')
const { checkTokenIsActive, getUserEmail } = require('../data/oauth')
const redis = require('../data/redis')
const User = require('../models/user')

jest.mock('passport-oauth2-refresh')
jest.mock('passport')
jest.mock('../data/oauth', () => ({
  checkTokenIsActive: jest.fn(),
  getUserEmail: jest.fn(),
}))
jest.mock('../data/redis', () => ({
  get: jest.fn(),
  set: jest.fn(),
}))

describe('Auth', () => {
  beforeEach(() => {
    getUserEmail.mockReset()
    redis.get.mockReset()
    redis.set.mockReset()
  })

  describe('tokenVerifier', () => {
    const baseRequest = {
      user: User.from({
        token: 'TOKEN',
      }),
    }

    beforeEach(() => checkTokenIsActive.mockReset())

    it('returns true if the token is active', async () => {
      const req = { ...baseRequest }
      checkTokenIsActive.mockResolvedValue(true)
      const result = await auth.tokenVerifier(req, true)
      expect(result).toBe(true)
    })

    it('returns true if the token has already been verified', async () => {
      const req = { ...baseRequest, verified: true }
      const result = await auth.tokenVerifier(req, true)
      expect(result).toBe(true)
      expect(checkTokenIsActive).not.toHaveBeenCalled()
    })

    it('returns false if the token is inactive', async () => {
      const req = { ...baseRequest }
      checkTokenIsActive.mockResolvedValue(false)
      const result = await auth.tokenVerifier(req, true)
      expect(result).toBe(false)
    })

    it('returns true if verification is turned off in configuration', async () => {
      const req = { ...baseRequest }
      const result = await auth.tokenVerifier(req, false)
      expect(result).toBe(true)
      expect(checkTokenIsActive).not.toHaveBeenCalled()
    })
  })

  describe('checkUserIsAuthenticated', () => {
    const req = {
      isAuthenticated: jest.fn(),
      originalUrl: '/foo/bar',
      session: {},
    }
    const res = {
      redirect: jest.fn(),
    }
    const next = jest.fn()
    const tokenVerifier = jest.fn()
    const checkUserIsAuthenticated = auth.checkUserIsAuthenticated(tokenVerifier)

    beforeEach(() => {
      req.isAuthenticated.mockReset()
      res.redirect.mockReset()
      next.mockReset()
      tokenVerifier.mockReset()
      req.session = {}
    })

    it('calls next if the user is authenticated and the token is valid', async () => {
      req.isAuthenticated.mockReturnValue(true)
      tokenVerifier.mockResolvedValue(true)

      await checkUserIsAuthenticated(req, res, next)

      expect(next).toHaveBeenCalled()
    })

    it('redirects the user to login if they are not authenticated', async () => {
      req.isAuthenticated.mockReturnValue(false)
      tokenVerifier.mockResolvedValue(true) // we expect to short circuit on the above

      await checkUserIsAuthenticated(req, res, next)

      expect(req.session.returnUrl).toEqual(req.originalUrl)
      expect(res.redirect).toHaveBeenCalledWith('/login')
    })

    it('redirects the user to login if the token is invalid', async () => {
      req.isAuthenticated.mockReturnValue(true) // we want to avoid a short circuit on the a first assertion
      tokenVerifier.mockResolvedValue(false)

      await checkUserIsAuthenticated(req, res, next)

      expect(req.session.returnUrl).toEqual(req.originalUrl)
      expect(res.redirect).toHaveBeenCalledWith('/login')
    })
  })

  describe('userHasExpiredToken', () => {
    it('returns true when the token has expired', () => {
      const now = Date.now()
      const expiry = now - 60

      const isExpired = auth.userHasExpiredToken(expiry, now)

      expect(isExpired).toBe(true)
    })

    it('returns true when the token is about to expire', () => {
      const now = Date.now()
      const expiry = now

      const isExpired = auth.userHasExpiredToken(expiry, now)

      expect(isExpired).toBe(true)
    })

    it('returns false when the token has not expired', () => {
      const now = Date.now()
      const expiry = now + 60

      const isExpired = auth.userHasExpiredToken(expiry, now)

      expect(isExpired).toBe(false)
    })
  })

  describe('checkForTokenRefresh', () => {
    const res = {}
    const next = jest.fn()

    beforeEach(() => {
      next.mockReset()
      refresh.requestNewAccessToken.mockReset()
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('refreshes the token when expired', done => {
      const now = Date.now()
      const expiry = now - 60

      const req = {
        user: User.from({
          username: 'Test User',
          refreshToken: 'REFRESH_TOKEN',
          tokenExpiryTime: expiry,
        }),
        session: {
          passport: { user: {} },
          save: jest.fn(),
        },
      }

      refresh.requestNewAccessToken.mockImplementation((strategy, refreshToken, cb) => {
        expect(strategy).toEqual('oauth2')
        expect(refreshToken).toEqual('REFRESH_TOKEN')
        cb(null, 'ACCESS_TOKEN', 'NEW_REFRESH_TOKEN')
      })

      auth.checkForTokenRefresh(req, res, () => {
        expect(req.user.refreshToken).toEqual('NEW_REFRESH_TOKEN')
        expect(req.session.save).toHaveBeenCalled()

        done()
      })
    })

    it('does not refresh the token when not expired', () => {
      const now = Date.now()
      const expiry = now + 60

      const req = {
        user: User.from({
          tokenExpiryTime: expiry,
        }),
      }

      auth.checkForTokenRefresh(req, res, next)
      expect(refresh.requestNewAccessToken).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })

    it('does nothing when there is no user', () => {
      const req = {}
      auth.checkForTokenRefresh(req, res, next)
      expect(refresh.requestNewAccessToken).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })
  })

  describe('handleLoginCallback', () => {
    const handleLoginCallback = auth.handleLoginCallback()
    const req = {
      session: {
        returnUrl: '/',
      },
    }
    const res = {}
    const next = jest.fn()

    const mockPassportAuthenticateMiddleware = jest.fn()
    passport.authenticate.mockImplementation(() => mockPassportAuthenticateMiddleware)

    it('calls the passport authenticate middleware', () => {
      handleLoginCallback(req, res, next)

      expect(passport.authenticate).toHaveBeenCalledWith('oauth2', {
        successReturnToOrRedirect: req.session.returnUrl,
        failureRedirect: '/login/error',
      })

      expect(mockPassportAuthenticateMiddleware).toHaveBeenCalledWith(req, res, next)
    })
  })

  describe('handleLogout', () => {
    const handleLogout = auth.handleLogout()
    const baseRequest = {
      logout: jest.fn(),
      session: {
        destroy: jest.fn(),
      },
    }
    const res = {
      redirect: jest.fn(),
    }

    beforeEach(() => {
      baseRequest.logout.mockReset()
      res.redirect.mockReset()
      baseRequest.session.destroy.mockReset()
      baseRequest.session.destroy.mockImplementation(fn => fn())
    })

    it('logs the user out and redirects if signed in', () => {
      const req = { ...baseRequest, user: User.from({ username: 'Test User' }) }

      handleLogout(req, res)

      expect(req.logout).toHaveBeenCalled()
      expect(req.session.destroy).toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalled()
    })

    it('redirects if the user is not logged in', () => {
      const req = baseRequest

      handleLogout(req, res)

      expect(req.logout).not.toHaveBeenCalled()
      expect(req.session.destroy).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalled()
    })
  })

  describe('generateBasicAuthToken', () => {
    it('generates a basic auth token', () => {
      const authToken = auth.generateBasicAuthToken('clientId', 'clientSecret')
      expect(authToken).toEqual('Basic Y2xpZW50SWQ6Y2xpZW50U2VjcmV0')
    })
  })

  describe('serializer', () => {
    it('sets the user serializer', async () => {
      expect(passport.serializeUser).toHaveBeenCalledTimes(1)
      const [serializer] = passport.serializeUser.mock.calls[0]
      expect(typeof serializer).toBe('function')

      getUserEmail.mockResolvedValue('foo@bar.baz')
      const callback = jest.fn()

      await serializer(User.from({ id: 1, token: 'FOO_TOKEN', username: 'Foo' }), callback)
      // We grab the user email
      expect(getUserEmail).toHaveBeenCalledWith('FOO_TOKEN')
      // Persist user details to Redis and key by the user's ID
      expect(redis.set).toHaveBeenCalledWith('user:1', '{"email":"foo@bar.baz","username":"Foo"}', 'EX', 43200)
      // Persist the user token to the session
      expect(callback).toHaveBeenCalledWith(null, { id: 1, token: 'FOO_TOKEN' })
    })

    it('does not fetch the user email if it already exists', async () => {
      expect(passport.serializeUser).toHaveBeenCalledTimes(1)
      const [serializer] = passport.serializeUser.mock.calls[0]
      expect(typeof serializer).toBe('function')

      getUserEmail.mockResolvedValue('foo@bar.baz')
      const callback = jest.fn()

      await serializer(User.from({ id: 1, token: 'FOO_TOKEN', username: 'Foo', email: 'foo@bar.baz' }), callback)
      // We grab the user email
      expect(getUserEmail).not.toHaveBeenCalled()
      expect(redis.set).toHaveBeenCalled()
      expect(callback).toHaveBeenCalled()
    })

    it('passes errors to the callback', async () => {
      expect(passport.serializeUser).toHaveBeenCalledTimes(1)
      const [serializer] = passport.serializeUser.mock.calls[0]
      expect(typeof serializer).toBe('function')

      getUserEmail.mockRejectedValue('💥')
      const callback = jest.fn()

      await serializer(User.from({ id: 1, token: 'FOO_TOKEN', username: 'Foo' }), callback)

      expect(callback).toHaveBeenCalledWith('💥')
    })
  })

  describe('deserializer', () => {
    it('sets the passport deserializer', async () => {
      expect(passport.deserializeUser).toHaveBeenCalledTimes(1)
      const [deserializer] = passport.deserializeUser.mock.calls[0]
      expect(typeof deserializer).toBe('function')

      redis.get.mockResolvedValue('{"email":"foo@bar.baz","username":"Foo"}')
      const callback = jest.fn()

      await deserializer(User.from({ id: 1, token: 'FOO_TOKEN', username: 'Foo', email: 'foo@bar.baz' }), callback)

      expect(redis.get).toHaveBeenCalledWith('user:1')
      expect(callback).toHaveBeenCalled()

      const [error, user] = callback.mock.calls[0]

      expect(error).toBeNull()
      expect(user.getDetails()).toEqual({
        username: 'Foo',
        email: 'foo@bar.baz',
      })
      expect(user.getSession()).toEqual({
        id: 1,
        token: 'FOO_TOKEN',
      })
    })

    it('passes errors to the callback', async () => {
      expect(passport.deserializeUser).toHaveBeenCalledTimes(1)
      const [deserializer] = passport.deserializeUser.mock.calls[0]
      expect(typeof deserializer).toBe('function')

      redis.get.mockRejectedValue('💥')
      const callback = jest.fn()

      await deserializer(User.from({ id: 1, token: 'FOO_TOKEN' }), callback)

      expect(callback).toHaveBeenCalledWith('💥', { id: 1, token: 'FOO_TOKEN' })
    })
  })
})
