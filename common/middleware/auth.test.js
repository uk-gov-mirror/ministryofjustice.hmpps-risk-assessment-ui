const refresh = require('passport-oauth2-refresh')
const passport = require('passport')
const auth = require('./auth')
const { checkTokenIsActive } = require('../data/oauth')

jest.mock('passport-oauth2-refresh')
jest.mock('passport')
jest.mock('../data/oauth', () => ({
  checkTokenIsActive: jest.fn(),
}))

describe('Auth', () => {
  describe('tokenVerifier', () => {
    const baseRequest = {
      user: {
        token: 'TOKEN',
      },
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
        user: {
          username: 'Test User',
          refreshToken: 'REFRESH_TOKEN',
          tokenExpiryTime: expiry,
        },
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
        user: {
          tokenExpiryTime: expiry,
        },
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
      const req = { ...baseRequest, user: { username: 'Test User' } }

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
})
