const BaseController = require('../../common/controllers/baseController')
const { getRegistrations, getRoshRiskSummary } = require('./common.utils')
const { getTaskList } = require('./taskList.utils')
const { getAnswers } = require('../../../common/data/hmppsAssessmentApi')
const { logger } = require('../../../common/logging/logger')
const { answerDtoFrom } = require('../../common/controllers/saveAndContinue.utils')

class TaskList extends BaseController {
  async locals(req, res, next) {
    res.locals.pageDescription =
      'Most of the questions in this assessment must be answered, but some are optional and are marked as such.'
    try {
      const journeyName = req.form?.options?.journeyName || ''
      const steps = req.form?.options?.steps || {}
      const answers = req.sessionModel.get('answers') || {}

      const { answers: previousAnswers } = await getAnswers(
        req.session.assessment?.uuid,
        req.session.assessment?.episodeUuid,
        req.user?.token,
        req.user?.id,
      )

      const consolidatedAnswers = { ...previousAnswers, ...answers }

      res.locals.taskList = getTaskList(`/${journeyName}`, steps, answerDtoFrom(consolidatedAnswers))
      res.locals.saveAssessmentUrl = `/${journeyName}/assessment-saved`

      const deliusRegistrations = await getRegistrations(req.session.assessment?.subject?.crn, req.user)
      const roshRiskSummary = await getRoshRiskSummary(req.session.assessment?.subject?.crn, req.user)

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

module.exports = TaskList
