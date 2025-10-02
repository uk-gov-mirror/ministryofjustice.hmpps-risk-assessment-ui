import SaveAndContinue from './saveAndContinue'
import { closeAssessment } from '../../../common/data/hmppsAssessmentApi'

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

export default CloseAssessment
