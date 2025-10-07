import BaseController from '../../common/controllers/baseController'
import { getRegistrations, getRoshRiskSummary } from './common.utils'
import { getTaskList } from './taskList.utils'
import { getAnswers } from '../../../common/data/hmppsAssessmentApi'
import logger from '../../../common/logging/logger'
import { CACHE } from '../../../common/utils/constants'

class TaskList extends BaseController {
  async locals(req, res, next) {
    res.locals.pageDescription =
      'Most of the questions in this assessment must be answered, but some are optional and are marked as such.'
    try {
      const journeyName = req.form?.options?.journeyName || ''
      const steps = req.form?.options?.steps || {}

      let persistedAnswers = req.sessionModel.get(CACHE.PERSISTED_ANSWERS)

      if (!persistedAnswers) {
        const { answers } = await getAnswers(
          req.session.assessment?.uuid,
          req.session.assessment?.episodeUuid,
          req.user?.token,
        )

        persistedAnswers = answers
      }

      const crn = req.session.assessment?.subject?.crn
      const { eventId } = req.session.assessment
      const deliusRegistrations = await getRegistrations(crn, eventId, req.user)
      const roshRiskSummary = await getRoshRiskSummary(crn, req.user)

      res.locals.taskList = getTaskList(`/${journeyName}`, steps, persistedAnswers, deliusRegistrations.flags || [])
      res.locals.saveAssessmentUrl = `/${journeyName}/assessment-saved`

      res.locals.widgetData = {
        ...deliusRegistrations,
        ...roshRiskSummary,
      }

      return super.locals(req, res, next)
    } catch (error) {
      logger.error(`Could not display task list for assessment ${req.session?.assessment?.uuid}, error: ${error}`)
      return res.render('app/error', { error })
    }
  }
}

export default TaskList
