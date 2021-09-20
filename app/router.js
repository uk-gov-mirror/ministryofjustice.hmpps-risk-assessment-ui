// Local dependencies
// const healthCheckFactory = require('../common/services/healthcheck')
//
// const {
//   apis: { offenderAssessments },
// } = require('../common/config')

const passport = require('passport')

const getOffenderDetails = require('../common/middleware/getOffenderDetails')
const getQuestionGroup = require('../common/middleware/questionGroups/getQuestionGroup')
const addUserToLocals = require('../common/middleware/add-user-information')

// pages
const { startController } = require('./start/get.controller')
const { areaSelectionController } = require('./areaSelectionPage/get.controller')
const { redirectToAssessmentList } = require('./areaSelectionPage/post.controller')
const { displayAssessmentsList } = require('./assessmentsList/get.controller')
const { displayQuestionGroup } = require('./questionGroup/get.controller')
const { displayAddRow } = require('./addRow/get.controller')
const { saveTableRow } = require('./addRow/post.controller')

const { displayDeleteRow } = require('./deleteRow/get.controller')
const { removeTableRow } = require('./deleteRow/post.controller')

const { editTableRow } = require('./editRow/get.controller')
const { updateTableRow } = require('./editRow/post.controller')

const { displayOverview } = require('./summary/get.controller')
const { completeAssessment } = require('./summary/post.controller')
const { saveQuestionGroup } = require('./questionGroup/post.controller')
const {
  questionGroupValidationRules,
  assembleDates,
  extractAnswers,
} = require('../common/middleware/questionGroups/postHandlers')
const { fetchFilteredReferenceData } = require('./referenceData/post.controller')
const { psrFromCourt } = require('./psrFromCourt/get.controller')
const { startPsrFromCourt, startPsrFromForm } = require('./psrFromCourt/post.controller')

const { assessmentFromCrn } = require('./assessmentFromCrn/get.controller')
const { startAssessmentFromCrn, startAssessmentFromForm } = require('./assessmentFromCrn/post.controller')

const { validate, localValidationRules } = require('../common/middleware/validator')

const {
  checkUserIsAuthenticated,
  handleLoginCallback,
  handleLogout,
  checkForTokenRefresh,
} = require('../common/middleware/auth')

const { checkUserHasAreaSelected } = require('../common/middleware/area-selection')

const {
  dev: { devAssessmentId },
} = require('../common/config')
const { displayPredictorScores } = require('./predictorScores/get.controller')
const { submitPredictorScores } = require('./submitPredictorScores/get.controller')

const rsrWorkflow = require('./rsr')

const logger = require('../common/logging/logger')

const assessmentUrl = `/${devAssessmentId}/questiongroup/ROSH/summary`

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
  app.use(['/login', '/logout'], (error, req, res, next) => {
    req.logout()
    req.session.destroy(() => {
      res.status(error.status || 500)
      res.render('app/error', {
        heading: 'Something went wrong',
        subHeading: 'We are unable to sign you in at this time',
        error,
      })
    })
  })

  app.use(checkUserIsAuthenticated(), checkForTokenRefresh, addUserToLocals)

  app.get(`/`, (req, res) => {
    res.redirect('/start')
  })
  app.get(`/start`, checkUserHasAreaSelected(assessmentUrl), startController)

  app.get(`/area-selection`, areaSelectionController)
  app.post('/area-selection', redirectToAssessmentList)

  app.get('*', checkUserHasAreaSelected())
  app.get(`/:assessmentId/assessments`, getOffenderDetails, displayAssessmentsList)

  app.get(`/:assessmentId/questiongroup/:assessmentSchemaCode/summary`, getOffenderDetails, displayOverview)

  app.get(
    `/:assessmentId/questiongroup/:groupId/:subgroup/:page`,
    getOffenderDetails,
    getQuestionGroup,
    displayQuestionGroup,
  )
  app.post(
    `/:assessmentId/questiongroup/:groupId/:subgroup/:page`,
    getOffenderDetails,
    getQuestionGroup,
    assembleDates,
    questionGroupValidationRules,
    localValidationRules,
    validate,
    extractAnswers,
    saveQuestionGroup,
  )

  app.post(`/:assessmentId/episode/:episodeId/referencedata/filtered`, fetchFilteredReferenceData)

  // add a new table row
  app.get(
    `/:assessmentId/questiongroup/:groupId/:subgroup/:page/addrow/:tableName`,
    getOffenderDetails,
    getQuestionGroup,
    displayAddRow,
  )
  app.post(
    `/:assessmentId/questiongroup/:groupId/:subgroup/:page/addrow/:tableName`,
    getOffenderDetails,
    getQuestionGroup,
    assembleDates,
    questionGroupValidationRules,
    validate,
    extractAnswers,
    saveTableRow,
  )

  // delete table row
  app.get(
    `/:assessmentId/questiongroup/:groupId/:subgroup/:page/delete/:tableName/:tableRow`,
    getOffenderDetails,
    getQuestionGroup,
    displayDeleteRow,
  )
  app.post('/:assessmentId/questiongroup/:groupId/:subgroup/:page/delete/:tableName/:tableRow', removeTableRow)

  // edit a table row
  app.get(
    `/:assessmentId/questiongroup/:groupId/:subgroup/:page/edit/:tableName/:tableRow`,
    getOffenderDetails,
    getQuestionGroup,
    editTableRow,
  )
  app.post(
    '/:assessmentId/questiongroup/:groupId/:subgroup/:page/edit/:tableName/:tableRow',
    getOffenderDetails,
    getQuestionGroup,
    assembleDates,
    questionGroupValidationRules,
    validate,
    extractAnswers,
    updateTableRow,
  )

  app.post('/:assessmentId/questiongroup/:groupId/summary', getOffenderDetails, completeAssessment)

  app.get('/psr-from-court', psrFromCourt)
  app.post('/psr-from-court', startPsrFromForm)
  app.post('/psr-from-court/:courtCode/case/:caseNumber', startPsrFromCourt)

  app.get('/assessment-from-delius', assessmentFromCrn)
  app.post('/assessment-from-delius', startAssessmentFromForm)
  app.post('/assessment-from-delius/:assessmentSchemaCode/crn/:crn/event/:deliusEventId', startAssessmentFromCrn)

  app.get('/:assessmentId/episode/:episodeId/:assessmentType/scores', getOffenderDetails, displayPredictorScores)
  app.get(
    '/:assessmentId/episode/:episodeId/:assessmentType/scores/complete',
    getOffenderDetails,
    submitPredictorScores,
  )

  // app.use('/:assessmentId/rsr', saveAssessmentId, rsrWorkflow)
  app.use('/:assessmentId/rsr', rsrWorkflow)

  app.use((error, req, res, next) => {
    logger.info(`Unhandled exception received - ${error.message} ${error.stack}`)
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
