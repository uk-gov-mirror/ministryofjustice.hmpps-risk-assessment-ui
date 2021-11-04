const BaseController = require('../../common/controllers/baseController')
const { getRegistrations } = require('./common.utils')
const { getTaskList } = require('./taskList.utils')

class TaskList extends BaseController {
  async locals(req, res, next) {
    res.locals.pageDescription =
      'Most of the questions in this assessment must be answered, but some are optional and are marked as such.'

    const journeyName = req.form?.options?.journeyName || ''
    const steps = req.form?.options?.steps || {}
    const answers = req.sessionModel.get('answers') || {}

    res.locals.taskList = getTaskList(`/${journeyName}`, steps, answers)
    res.locals.widgetData = await getRegistrations(res.locals.assessment?.subject?.crn, req.user)

    super.locals(req, res, next)
  }
}

module.exports = TaskList
