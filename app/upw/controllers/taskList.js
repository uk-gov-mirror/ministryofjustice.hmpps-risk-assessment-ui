const BaseController = require('../../common/controllers/baseController')
const { getTaskList } = require('./taskList.utils')

class TaskList extends BaseController {
  locals(req, res, next) {
    res.locals.pageDescription =
      'Most of the questions in this assessment must be answered, but some are optional and are marked as such.'

    const journeyName = req.form?.options?.journeyName || ''
    const steps = req.form?.options?.steps || {}
    const answers = req.sessionModel.get('answers') || {}

    res.locals.taskList = getTaskList(`/${journeyName}`, steps, answers)

    super.locals(req, res, next)
  }
}

module.exports = TaskList
