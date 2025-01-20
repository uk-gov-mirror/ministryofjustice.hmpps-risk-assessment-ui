// Node.js core dependencies
const { join } = require('path')
const crypto = require('crypto')

// Npm dependencies
const appInsights = require('applicationinsights')
const express = require('express')
const cookieParser = require('cookie-parser')
const { json, urlencoded } = require('body-parser')
const loggingMiddleware = require('morgan')
const compression = require('compression')
const { configure } = require('nunjucks')
const dateFilter = require('nunjucks-date-filter')
const session = require('express-session')
const helmet = require('helmet')
const passport = require('passport')
const RedisStore = require('connect-redis').default

// Local dependencies
// eslint-disable-next-line import/no-extraneous-dependencies
const argv = require('minimist')(process.argv.slice(2))
const staticify = require('staticify')(join(__dirname, 'public'))
const { mojDate } = require('./node_modules/@ministryofjustice/frontend/moj/filters/all')()
const logger = require('./common/logging/logger')
const router = require('./app/router')
const noCache = require('./common/utils/no-cache')
const { mdcSetup } = require('./common/logging/logger-mdc')
const { updateCorrelationId } = require('./common/middleware/updateCorrelationId')
const { applicationInsights } = require('./common/config')
const {
  encodeHTML,
  extractLink,
  doReplace,
  updateJsonValue,
  prettyDate,
  ageFrom,
  prettyDateAndTime,
  clearAnswers,
  disabilityCodeToDescription,
  splitLines,
  todayPretty,
  groupDisabilities,
  groupProvisions,
} = require('./common/utils/util')
const config = require('./common/config')
const auth = require('./common/middleware/auth')
const redis = require('./common/data/redis')
const { REFRESH_TOKEN_LIFETIME_SECONDS, SIXTY_SECONDS } = require('./common/utils/constants')

const { hasBothModernSlaveryFlags } = require('./app/upw/controllers/common.utils')
const { isModernSlaveryVictim } = require('./app/upw/controllers/common.utils')
const { isModernSlaveryPerpetrator } = require('./app/upw/controllers/common.utils')

// Global constants
const { static: _static } = express
const unconfiguredApp = express()
const oneYear = 86400000 * 365
const publicCaching = { maxAge: oneYear }
const PORT = process.env.PORT || 3000
const { NODE_ENV } = process.env
const CSS_PATH = staticify.getVersionedPath('/stylesheets/application.min.css')
const JAVASCRIPT_PATH = staticify.getVersionedPath('/javascripts/application.js')
const allGateKeeperPages = /^\/(?!health$).*/

// Define app views
const APP_VIEWS = [
  join(__dirname, 'node_modules/govuk-frontend/dist'),
  join(__dirname, 'node_modules/@ministryofjustice/frontend/'),
  __dirname,
]

function initialiseApplicationInsights() {
  if (applicationInsights.disabled) {
    logger.info('Application Insights disabled; disable flag set')
    return
  }

  if (applicationInsights.instrumentationKey === '') {
    logger.info('Application Insights disabled; no instrumentation key set')
    return
  }

  appInsights
    .setup()
    .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
    .setInternalLogging(applicationInsights.internalLogging, true)
    .start()

  const roleName = process.env.npm_package_name
  appInsights.defaultClient.context.tags['ai.cloud.role'] = roleName

  logger.info(`Application Insights enabled with role name '${roleName}'`)
}

async function initialiseGlobalMiddleware(app) {
  app.set('settings', { getVersionedPath: staticify.getVersionedPath })
  app.use((_req, res, next) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString('hex')
    next()
  })
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          connectSrc: ["'self'", 'dc.services.visualstudio.com/v2/track'],
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            'js.monitor.azure.com',
            "'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU='",
            "'sha256-m5Sbrhw+r00tt+60yyAghRM3ydJ7im+KM/aKiPEK/HQ='",
            "'sha256-KRSTS/E0qGKsfXMQ4E12L0K3g+FJNXiXgJSYfVQV91M='",
            "'sha256-TKr7E5adYQIZfInlwPaDsfURYufKvKlSM0oNSK0yZwI='",
            "'sha256-aC+Kg9O1M7kgGrqr2caWuEs3eY9R8msK8cFrLtguFY4='",
            "'sha256-9YsoG/P7wvqSx6FVKCl5C73RpWzbIaMsbYfxLUQeDto='",
            "'sha256-OMPCbW+0lYfE0SfAtKG15jIcU3/75d0fjIKf/f59gE4='",
            (_req, res) => `'nonce-${res.locals.cspNonce}'`,
          ],
          styleSrc: ["'self'", (_req, res) => `'nonce-${res.locals.cspNonce}'`],
          fontSrc: ["'self'"],
          formAction: [`'self' ${config.apis.oauth.url}`],
        },
      },
      crossOriginEmbedderPolicy: true,
    }),
  )
  // app.use(favicon(join(__dirname, 'public/images/', 'favicon.ico')))
  app.use(compression())
  app.use(staticify.middleware)

  if (process.env.DISABLE_REQUEST_LOGGING !== 'true') {
    app.use(
      /\/((?!images|public|stylesheets|javascripts).)*/,
      loggingMiddleware(
        ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - total time :response-time ms',
      ),
    )
  }

  app.use((req, res, next) => {
    res.locals.asset_path = '/public/' // eslint-disable-line camelcase
    res.locals.showDetailedErrors = process.env.SHOW_DETAILED_ERRORS === 'true'
    res.locals.showRequestIdOnErrorPage = process.env.SHOW_REQUEST_ID_ON_ERROR_PAGE === 'true'
    noCache(res)
    next()
  })

  if (config.displayMaintenancePage && config.maintenancePageText) {
    logger.info('Maintenance page enabled')
    app.get('*', (req, res) => {
      res.locals.maintenancePageText = config.maintenancePageText
      return res.render('common/templates/maintenance-page.njk')
    })
  }

  app.use(json())
  app.use(urlencoded({ extended: true }))
  app.use(allGateKeeperPages, (req, res, next) => {
    res.locals.requested_url = req.originalUrl
    next()
  })

  app.use(cookieParser())

  await redis.client.connect()

  app.use(
    session({
      store: new RedisStore({ client: redis.client }),
      secret: config.sessionSecret,
      cookie: {
        secure: config.https,
        sameSite: 'lax',
        maxAge: (REFRESH_TOKEN_LIFETIME_SECONDS - SIXTY_SECONDS) * 1000,
      },
      resave: false, // redis implements touch so shouldn't need this
      saveUninitialized: false,
      rolling: true,
    }),
  )

  auth.init(passport)
  app.use(passport.initialize())
  app.use(passport.session())

  // add instrumentation key to app so it can be picked up in front end templates
  // eslint-disable-next-line no-param-reassign
  app.locals.applicationInsightsInstrumentationKey = applicationInsights.instrumentationKey

  // add role name to app so it can be picked up in front end templates
  // eslint-disable-next-line no-param-reassign
  app.locals.applicationInsightsRoleName = process.env.npm_package_name

  // must be after session since we need session
  app.use(mdcSetup)
  app.use(updateCorrelationId)
}

function initialiseProxy(app) {
  app.enable('trust proxy')
}

function initialiseTemplateEngine(app) {
  // Configure nunjucks
  // see https://mozilla.github.io/nunjucks/api.html#configure
  const nunjucksConfiguration = {
    express: app, // The express app that nunjucks should install to
    autoescape: true, // Controls if output with dangerous characters are escaped automatically
    throwOnUndefined: false, // Throw errors when outputting a null/undefined value
    trimBlocks: true, // Automatically remove trailing newlines from a block/tag
    lstripBlocks: true, // Automatically remove leading whitespace from a block/tag
    watch: NODE_ENV !== 'production', // Reload templates when they are changed (server-side). To use watch, make sure optional dependency chokidar is installed
    noCache: NODE_ENV !== 'production', // Never use a cache and recompile templates each time (server-side)
  }

  // Initialise nunjucks environment
  const nunjucksEnvironment = configure(APP_VIEWS, nunjucksConfiguration)

  // add custom date formatters
  nunjucksEnvironment.addFilter('date', dateFilter)
  nunjucksEnvironment.addFilter('mojDate', mojDate)
  nunjucksEnvironment.addFilter('prettyDate', prettyDate)
  nunjucksEnvironment.addFilter('prettyDateAndTime', prettyDateAndTime)
  nunjucksEnvironment.addFilter('ageFrom', ageFrom)
  nunjucksEnvironment.addFilter('todayPretty', todayPretty)

  // add answer formatters
  nunjucksEnvironment.addFilter('clearAnswers', clearAnswers)
  nunjucksEnvironment.addFilter('hasAnswer', (a, v) => Array.isArray(a) && a.includes(v))
  nunjucksEnvironment.addFilter('toDisabilityDescription', disabilityCodeToDescription)

  nunjucksEnvironment.addFilter(
    'shouldDisplayModernSlaveryVictimSection',
    (flags = []) => isModernSlaveryVictim(flags) && !isModernSlaveryPerpetrator(flags),
  )
  nunjucksEnvironment.addFilter(
    'shouldDisplayModernSlaveryPerpetratorSection',
    (flags = []) => isModernSlaveryPerpetrator(flags) || hasBothModernSlaveryFlags(flags),
  )

  // for textarea or input components we can add an extra filter to encode any raw HTML characters
  // that might cause security issues otherwise
  nunjucksEnvironment.addFilter('encodeHtml', (str) => encodeHTML(str))
  nunjucksEnvironment.addFilter('splitLines', splitLines)
  nunjucksEnvironment.addFilter('extractLink', (str) => extractLink(str))
  nunjucksEnvironment.addFilter('doReplace', (str, target, replacement) => doReplace(str, target, replacement))

  // typeof for array, using native JS Array.isArray()
  nunjucksEnvironment.addFilter('isArr', (str) => Array.isArray(str))
  nunjucksEnvironment.addFilter('addSpellcheck', (jsonObj) => updateJsonValue(jsonObj, 'spellcheck', true, true))
  nunjucksEnvironment.addFilter('updateJsonValue', (jsonObj, keyToChange, newValue) =>
    updateJsonValue(jsonObj, keyToChange, newValue),
  )
  nunjucksEnvironment.addFilter('shiftArray', (arr) => {
    return arr.slice(1)
  })

  nunjucksEnvironment.addFilter('groupDisabilities', groupDisabilities)
  nunjucksEnvironment.addFilter('groupProvisions', groupProvisions)

  // Set view engine
  app.set('view engine', 'njk')

  // Version static assets on production for better caching
  // if it's not production we want to re-evaluate the assets on each file change
  nunjucksEnvironment.addGlobal(
    'css_path',
    NODE_ENV === 'production' ? CSS_PATH : staticify.getVersionedPath('/stylesheets/application.min.css'),
  )
  nunjucksEnvironment.addGlobal(
    'js_path',
    NODE_ENV === 'production' ? JAVASCRIPT_PATH : staticify.getVersionedPath('/javascripts/application.js'),
  )
}

function initialisePublic(app) {
  app.use('/assets', _static(join(__dirname, '/node_modules/@ministryofjustice/frontend/moj/assets')))
  app.use('/assets', _static(join(__dirname, '/node_modules/govuk-frontend/dist/govuk/assets')))
  app.use('/javascripts', _static(join(__dirname, '/public/javascripts'), publicCaching))
  app.use('/images', _static(join(__dirname, '/public/images'), publicCaching))
  app.use('/stylesheets', _static(join(__dirname, '/public/stylesheets'), publicCaching))
  app.use('/downloads', _static(join(__dirname, '/public/downloads'), publicCaching))
}

function initialiseRoutes(app) {
  router(app)
}

async function listen() {
  const app = await initialise()
  app.listen(PORT)
  logger.info(`Listening on port ${PORT}`)
}

/**
 * Configures app
 * @return app
 */
async function initialise() {
  const app = unconfiguredApp
  app.disable('x-powered-by')
  initialiseApplicationInsights()
  initialiseProxy(app)
  initialisePublic(app)
  await initialiseGlobalMiddleware(app)
  initialiseTemplateEngine(app)
  initialiseRoutes(app)
  return app
}

/**
 * Starts app after ensuring DB is up
 */
async function start() {
  await listen()
}

/**
 * -i flag. Immediately invoke start.
 * Allows script to be run by task runner
 */
if (argv.i) {
  start()
}

module.exports = { start, getApp: initialise, staticify }
