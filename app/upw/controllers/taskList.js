const BaseController = require('../../common/controllers/baseController')
const { getRegistrations, getRoshRiskSummary } = require('./common.utils')
const { getTaskList } = require('./taskList.utils')

class TaskList extends BaseController {
  async locals(req, res, next) {
    res.locals.pageDescription =
      'Most of the questions in this assessment must be answered, but some are optional and are marked as such.'

    const journeyName = req.form?.options?.journeyName || ''
    const steps = req.form?.options?.steps || {}
    const answers = req.sessionModel.get('answers') || {}

    res.locals.taskList = getTaskList(`/${journeyName}`, steps, answers)
    res.locals.saveAssessmentUrl = `/${journeyName}/assessment-saved`

    const deliusRegistrations = await getRegistrations(req.session.assessment?.subject?.crn, req.user)
    const roshRiskSummary = await getRoshRiskSummary(req.session.assessment?.subject?.crn, req.user)

    res.locals.widgetData = {
      ...deliusRegistrations,
      ...roshRiskSummary,
    }

    super.locals(req, res, next)
  }
}

module.exports = TaskList
