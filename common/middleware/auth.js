const passport = require('passport')
const { Strategy } = require('passport-oauth2')
const refresh = require('passport-oauth2-refresh')
const { checkTokenIsActive } = require('../data/oauth')
const config = require('../config')
const logger = require('../logging/logger')

// Required by Passport - http://www.passportjs.org/docs/configure/#sessions
passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

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
    return refresh.requestNewAccessToken('oauth2', user.refreshToken, (err, accessToken, refreshToken) => {
      if (err) {
        logger.info(`Failed to refresh token for user: ${user.username}`)
        next(err)
      }

      req.user = { ...user, accessToken, refreshToken, tokenExpiryTime: Date.now() + user.tokenLifetime }
      req.session.passport.user = req.user
      req.session.save()
      logger.info(`Token refreshed for user: ${user.username}`)
      next()
    })
  }
  return next()
}

const handleLoginCallback = () => {
  return (req, res, next) => {
    passport.authenticate('oauth2', {
      successReturnToOrRedirect: req.session.returnUrl || '/',
      failureRedirect: '/login/error',
    })(req, res, next)
  }
}

const handleLogout = () => {
  const logoutUrl = `${config.apis.oauth.url}/logout?client_id=${config.authClientId}&redirect_uri=${config.domain}`

  return (req, res) => {
    if (req.user) {
      const { username } = req.user
      req.logout()
      req.session.destroy(() => res.redirect(logoutUrl))
      logger.info(`User logged out: ${username}}`)
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
      authorizationURL: `${apis.oauth.url}/oauth/authorize`,
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
      // OASys call for user information could live here?
      done(null, {
        token,
        refreshToken,
        tokenLifetime: params.expires_in,
        tokenExpiryTime: Date.now() + params.expires_in,
        username: params.user_name,
        authSource: params.auth_source,
      })
    },
  )

  passport.use(strategy)
  refresh.use(strategy)
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
}
