// Local dependencies
// const healthCheckFactory = require('../common/services/healthcheck')
//
// const {
//   apis: { offenderAssessments },
// } = require('../common/config')

const passport = require('passport')

const getOffenderDetails = require('../common/middleware/getOffenderDetails')
const getQuestionGroup = require('../common/middleware/getQuestionGroup')
const addUserToLocals = require('../common/middleware/add-user-information')

// pages
const { startController } = require('./start/get.controller')
const { displayAssessmentsList } = require('./assessmentsList/get.controller')
const { displayQuestionGroup } = require('./questionGroup/get.controller')
const { displayAddRow } = require('./addRow/get.controller')
const { saveTableRow } = require('./addRow/post.controller')

const { displayOverview } = require('./summary/get.controller')
const { completeAssessment } = require('./summary/post.controller')
const { saveQuestionGroup } = require('./questionGroup/post.controller')
const { questionGroupValidationRules, assembleDates } = require('../common/question-groups/post-question-groups')
const { fetchFilteredReferenceData } = require('./referenceData/post.controller')
const { psrFromCourt } = require('./psrFromCourt/get.controller')
const { startPsrFromCourt, startPsrFromForm } = require('./psrFromCourt/post.controller')

const { assessmentFromCrn } = require('./assessmentFromCrn/get.controller')
const { startAssessmentFromCrn, startAssessmentFromForm } = require('./assessmentFromCrn/post.controller')

const { validate } = require('../common/middleware/validator')

const {
  checkUserIsAuthenticated,
  handleLoginCallback,
  handleLogout,
  checkForTokenRefresh,
} = require('../common/middleware/auth')

// Export
module.exports = app => {
  // app.get('/health', (req, res, next) => {
  //   const healthService = healthCheckFactory({ name: 'sentencePlanning', config: sentencePlanning })
  //   healthService((err, result) => {
  //     if (err) {
  //       return next(err)
  //     }
  //     if (!result.healthy) {
  //       res.status(503)
  //     }
  //     res.json(result)
  //     return result
  //   })
  // })

  app.get('/health', (req, res, next) => {
    res.status(200).send({
      healthy: true,
    })
  })

  app.get('/ping', (req, res) => {
    res.status(200).send('pong')
  })

  app.get('/login', passport.authenticate('oauth2'))
  app.get('/login/callback', handleLoginCallback())
  app.get('/logout', handleLogout())
  app.get('/login/error', (req, res) => res.status(401).render('app/error', { error: 'Unable to sign in' }))

  app.use(checkUserIsAuthenticated(), checkForTokenRefresh, addUserToLocals)

  app.get(`/`, (req, res) => {
    res.redirect('/start')
  })
  app.get(`/start`, startController)

  app.get(`/:assessmentId/assessments`, getOffenderDetails, displayAssessmentsList)

  app.get(`/:assessmentId/questiongroup/:groupId/summary`, getOffenderDetails, displayOverview)

  app.get(
    `/:assessmentId/questiongroup/:groupId/:subgroup/:page`,
    getOffenderDetails,
    getQuestionGroup,
    displayQuestionGroup,
  )
  app.post(
    `/:assessmentId/questiongroup/:groupId/:subgroup/:page`,
    getOffenderDetails,
    assembleDates,
    getQuestionGroup,
    questionGroupValidationRules,
    validate,
    saveQuestionGroup,
  )

  app.post(`/:assessmentId/episode/:episodeId/referencedata/filtered`, fetchFilteredReferenceData)

  app.get(
    `/:assessmentId/questiongroup/:groupId/:subgroup/:page/addrow/:tableName`,
    getOffenderDetails,
    getQuestionGroup,
    displayAddRow,
  )
  app.post(
    `/:assessmentId/questiongroup/:groupId/:subgroup/:page/addrow/:tableName`,
    getOffenderDetails,
    assembleDates,
    getQuestionGroup,
    questionGroupValidationRules,
    validate,
    saveTableRow,
  )

  app.post('/:assessmentId/questiongroup/:groupId/summary', getOffenderDetails, completeAssessment)

  app.get('/psr-from-court', psrFromCourt)
  app.post('/psr-from-court', startPsrFromForm)
  app.post('/psr-from-court/:courtCode/case/:caseNumber', startPsrFromCourt)

  app.get('/assessment-from-delius', assessmentFromCrn)
  app.post('/assessment-from-delius', startAssessmentFromForm)
  app.post('/assessment-from-delius/:assessmentType/crn/:crn/event/:deliusEventId', startAssessmentFromCrn)

  app.get('*', (req, res) => res.status(404).render('app/error', { error: '404, Page Not Found' }))
}
