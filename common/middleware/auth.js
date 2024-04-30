const passport = require('passport')
const { Strategy } = require('passport-oauth2')
const refresh = require('passport-oauth2-refresh')
const jwtDecode = require('jwt-decode')
const jwksRsa = require('jwks-rsa')
const { expressjwt: jwt } = require('express-jwt')
const { DateTime } = require('luxon')
const { checkTokenIsActive } = require('../data/oauth')
const { cacheUserDetails, getCachedUserDetails } = require('../data/userDetailsCache')
const config = require('../config')
const logger = require('../logging/logger')
const User = require('../models/user')
const { SIXTY_SECONDS } = require('../utils/constants')

const getAndCacheUserDetails = async (user) => {
  return cacheUserDetails(jwtDecode(user.token))
}

passport.serializeUser(async (req, user, done) => {
  try {
    await getAndCacheUserDetails(user)
    done(null, user.getSession())
  } catch (error) {
    done(error)
  }
})

passport.deserializeUser(async (req, serializedUser, done) => {
  try {
    const user = User.from(serializedUser)
    const serializedDetails = await getCachedUserDetails(user.id)

    const details = serializedDetails !== null ? serializedDetails : await getAndCacheUserDetails(user)

    user.withDetails(details)
    done(null, user)
  } catch (error) {
    done(error)
  }
})

const tokenVerifier = async (req, enabled = config.apis.oauth.verifyToken) => {
  const { user, verified } = req

  if (!enabled) {
    return true
  }

  if (verified) {
    return true
  }

  const result = await checkTokenIsActive(user.token)
  if (result) {
    req.verified = true
  }
  return result
}

const checkUserIsAuthenticated = (verifyToken = tokenVerifier) => {
  return async (req, res, next) => {
    if (req.isAuthenticated() && (await verifyToken(req))) {
      return next()
    }

    req.session.returnUrl = req.originalUrl
    return res.redirect('/login')
  }
}

const userHasExpiredToken = (tokenExpiryTime, nowInSeconds = Date.now()) => tokenExpiryTime <= nowInSeconds

const checkForTokenRefresh = (req, res, next) => {
  const { user } = req
  if (user && userHasExpiredToken(user.tokenExpiryTime)) {
    logger.info(`Token expiring for user: ${user.username} - attempting refresh`)
    return refresh.requestNewAccessToken('oauth2', user.refreshToken, (err, token, refreshToken) => {
      if (err) {
        logger.error(`Failed to refresh token for user: ${user.username} with error: ${err}`)
        return next(err)
      }

      req.user = user.updateToken({
        token,
        refreshToken,
        tokenExpiryTime: DateTime.now()
          .plus({ seconds: user.tokenLifetime - SIXTY_SECONDS })
          .valueOf(),
      })

      req.session.passport.user = req.user.getSession()
      req.session.save()

      logger.info(`Token refreshed for user: ${user.username}`)
      return next()
    })
  }
  return next()
}

const handleLoginCallback = () => {
  return (req, res, next) => {
    passport.authenticate('oauth2', {
      successReturnToOrRedirect: req.session.returnUrl || '/',
      failureRedirect: '/login',
    })(req, res, next)
  }
}

const handleLogout = () => {
  const logoutUrl = `${config.apis.oauth.url}/logout?client_id=${config.authClientId}&redirect_uri=${config.domain}`

  return (req, res, next) => {
    if (req.user) {
      const { username } = req.user
      req.logout((err) => {
        if (err) {
          next(err)
          return
        }

        res.redirect(logoutUrl)
        logger.info(`User logged out: ${username}}`)
      })
      return
    }

    res.redirect(logoutUrl)
  }
}

const generateBasicAuthToken = (clientId, clientSecret) => {
  const clientCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  return `Basic ${clientCredentials}`
}

const initializeAuth = () => {
  const { authClientId, authClientSecret, apis, domain } = config

  if (!config.authClientId || !config.authClientSecret || !domain || !config.apis?.oauth?.url) {
    throw new Error('Configuration missing for Auth')
  }

  const strategy = new Strategy(
    {
      authorizationURL: `${apis.oauth.externalUrl}/oauth/authorize`,
      tokenURL: `${apis.oauth.url}/oauth/token`,
      clientID: authClientId,
      clientSecret: authClientSecret,
      callbackURL: `${domain}/login/callback`,
      state: true,
      customHeaders: { Authorization: generateBasicAuthToken(authClientId, authClientSecret) },
    },
    (token, refreshToken, params, profile, done) => {
      logger.info(`User logged in: ${params.user_name}}`)
      // Token expiry = 1hr, Refresh token = 12hr
      done(
        null,
        User.from({
          id: params.user_id,
          token,
          refreshToken,
          tokenLifetime: params.expires_in,
          tokenExpiryTime: DateTime.now()
            .plus({ seconds: params.expires_in - SIXTY_SECONDS })
            .valueOf(),
        }),
      )
    },
  )

  passport.use(strategy)
  refresh.use(strategy)
}

const clientIsAuthenticated = () => {
  return jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${config.apis.oauth.url}/.well-known/jwks.json`,
    }),
    issuer: `${config.apis.oauth.url}/issuer`,
    algorithms: ['RS256'],
  })
}

const clientHasRole = (role) => (req, res, next) => {
  const roles = req.auth?.authorities || []

  if (!roles.includes(role)) {
    logger.info(`Client missing required role: ${role}`)
    return res.status(403).json({ reason: `Missing required role: ${role}` })
  }

  return next()
}

const apiErrorHandler = (err, req, res, next) => {
  if (err) {
    if (err.name === 'UnauthorizedError') {
      logger.info(`Invalid token: ${err.code}`)
      return res.status(401).json({ reason: 'Token invalid' })
    }

    return res.status(500).json({ reason: `Server error: ${err.name}` })
  }

  return next()
}

module.exports = {
  checkUserIsAuthenticated,
  checkForTokenRefresh,
  handleLoginCallback,
  handleLogout,
  init: initializeAuth,
  generateBasicAuthToken,
  userHasExpiredToken,
  tokenVerifier,
  requestIsAuthenticated: clientIsAuthenticated,
  clientHasRole,
  apiErrorHandler,
}
