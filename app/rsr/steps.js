const StartRsrAssessment = require('./controllers/start')
const SaveAndContinue = require('./controllers/saveAndContinue')
const GetPredictorScores = require('./controllers/getPredictorScores')
const CompleteRsrAssessment = require('./controllers/completeRsrAssessment')

module.exports = {
  '/start': {
    pageTitle: 'Start',
    controller: StartRsrAssessment,
    reset: true,
    entryPoint: true,
    template: `${__dirname}/templates/start`,
    next: 'offences-and-convictions',
  },
  '/offences-and-convictions': {
    pageTitle: 'Offences and convictions',
    controller: SaveAndContinue,
    fields: ['completed_interview'], // Fields omitted for brevity
    next: [
      {
        // Skip the needs section if an interview has not been conducted
        field: 'completed_interview',
        value: 'NO',
        next: 'predictor-scores',
      },
      'needs', // else default to the needs page
    ],
    template: `${__dirname}/templates/offences`,
  },
  '/needs': {
    pageTitle: 'Needs',
    controller: SaveAndContinue,
    fields: [], // Fields omitted for brevity
    next: 'predictor-scores',
    template: `${__dirname}/templates/needs`,
  },
  '/predictor-scores': {
    pageTitle: 'Scores',
    controller: GetPredictorScores,
    next: 'complete',
    noPost: true,
    template: `${__dirname}/templates/scores`,
  },
  '/complete': {
    pageTitle: 'Complete',
    controller: CompleteRsrAssessment,
    noPost: true,
    template: `${__dirname}/templates/complete`,
  },
}
