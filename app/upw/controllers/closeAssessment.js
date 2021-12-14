/* eslint-disable class-methods-use-this */
const SaveAndContinue = require('./saveAndContinue')
const { closeAssessment } = require('../../../common/data/hmppsAssessmentApi')

class CloseAssessment extends SaveAndContinue {
  async render(req, res, next) {
    try {
      const [assessmentClosed] = await closeAssessment(
        req.session.assessment.uuid,
        req.session.assessment.episodeUuid,
        req.user,
      )

      if (!assessmentClosed) {
        throw new Error('Failed to close the assessment')
      }

      delete req.session.assessment
      req.session.save()

      return super.render(req, res, next)
    } catch (e) {
      return next(e)
    }
  }
}

module.exports = CloseAssessment
