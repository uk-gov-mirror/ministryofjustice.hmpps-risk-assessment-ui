const passport = require('passport')
const { Strategy } = require('passport-oauth2')
const refresh = require('passport-oauth2-refresh')
const { addSeconds } = require('date-fns')
const { checkTokenIsActive, getUserEmail } = require('../data/oauth')
const config = require('../config')
const logger = require('../logging/logger')
const redis = require('../data/redis')
const User = require('../models/user')
const { REFRESH_TOKEN_LIFETIME_SECONDS, SIXTY_SECONDS } = require('../utils/constants')

passport.serializeUser(async (user, done) => {
  try {
    if (!user.email) {
      const email = await getUserEmail(user.token)
      user.setEmail(email)
    }
    const serialisedDetails = JSON.stringify(user.getDetails())
    await redis.set(`user:${user.id}`, serialisedDetails, 'EX', REFRESH_TOKEN_LIFETIME_SECONDS)
    done(null, user.getSession())
  } catch (e) {
    done(e)
  }
})

passport.deserializeUser(async (serializedUser, done) => {
  try {
    const user = User.from(serializedUser)
    const serializedDetails = await redis.get(`user:${user.id}`)
    if (serializedDetails !== null) {
      const details = JSON.parse(serializedDetails)
      user.withDetails(details)
    }
    done(null, user)
  } catch (e) {
    done(e, serializedUser)
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

      const now = new Date()

      req.user = user.updateToken({
        token,
        refreshToken,
        tokenExpiryTime: addSeconds(now, user.tokenLifetime - SIXTY_SECONDS).valueOf(),
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
      const now = new Date()
      done(
        null,
        User.from({
          id: params.user_id,
          token,
          refreshToken,
          tokenLifetime: params.expires_in,
          tokenExpiryTime: addSeconds(now, params.expires_in - SIXTY_SECONDS).valueOf(),
        }).withDetails({
          username: params.user_name,
        }),
      )
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
