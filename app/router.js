const passport = require('passport')
const xss = require('xss-clean')

const addUserToLocals = require('../common/middleware/add-user-information')

const {
  checkUserIsAuthenticated,
  handleLoginCallback,
  handleLogout,
  checkForTokenRefresh,
  requestIsAuthenticated,
  apiErrorHandler,
  clientHasRole,
} = require('../common/middleware/auth')

const upwWorkflow = require('./upw')

const logger = require('../common/logging/logger')
const { verifyAssessment } = require('./startAssessment/get.controller')
const { getCorrelationId } = require('../common/utils/util')
const { downloadUpwPdf } = require('./upw/controllers/api')

// Export
module.exports = (app) => {
  app.get('/health', (req, res, next) => {
    res.status(200).send({
      healthy: true,
    })
  })

  app.get('/ping', (req, res) => {
    res.status(200).send('pong')
  })

  app.use(
    '/api/upw/download/:episodeId',
    requestIsAuthenticated(),
    clientHasRole('ROLE_UPW_READ_ONLY'),
    downloadUpwPdf,
    apiErrorHandler,
  )

  app.get('/login', passport.authenticate('oauth2'))
  app.get('/login/callback', handleLoginCallback())
  app.get('/logout', handleLogout())
  app.use(['/login', '/logout'], (error, req, res, next) => {
    res.status(error.status || 500)
    res.render('app/error', {
      heading: 'Something went wrong',
      subHeading: 'We are unable to sign you in at this time',
      error,
    })
  })

  app.use(checkUserIsAuthenticated(), checkForTokenRefresh, addUserToLocals)

  app.post('*', xss())

  app.get(['/start-assessment', '/assessment-from-delius'], verifyAssessment)
  app.use('/upw', upwWorkflow)

  app.use((error, req, res, next) => {
    logger.info(`Unhandled exception received - ${error.message} ${error.stack}`)
    res.locals.correlationId = getCorrelationId()
    res.render('app/error', {
      subHeading: 'Something unexpected happened',
      error,
    })
  })

  app.get('*', (req, res) =>
    res.status(404).render('app/error', {
      subHeading: "We're unable to find the page you're looking for",
    }),
  )
}
