const { Controller } = require('hmpo-form-wizard')

class GetPredictorScores extends Controller {
  locals(req, res, next) {
    res.locals.predictorScores = {
      current: {
        date: '13 Aug 2021 at 08:26:21',
        scores: {
          RSR: { type: 'RSR', level: 'HIGH', score: 11.34 },
          OSPC: { type: 'OSP/C', level: 'MEDIUM', score: 8.76 },
          OSPI: { type: 'OSP/I', level: 'LOW', score: 3.45 },
        },
      },
    }
    res.locals.heading = `Scores for ${req.session.assessment?.subject?.name || ' the offender'}`
    super.locals(req, res, next)
  }
}

module.exports = GetPredictorScores
