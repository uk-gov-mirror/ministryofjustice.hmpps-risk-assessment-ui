const TaskList = require('./taskList')
const { getTaskList } = require('./taskList.utils')
const { getAnswers } = require('../../../common/data/hmppsAssessmentApi')

jest.mock('./taskList.utils')
jest.mock('../../../common/data/hmppsAssessmentApi')

let req
const user = { token: 'mytoken', id: '1' }
const assessmentUuid = '22222222-2222-2222-2222-222222222221'
const episodeUuid = '22222222-2222-2222-2222-222222222222'

const controller = new TaskList({
  route: 'test-route',
})

describe('TaskListController', () => {
  const mockSessionModel = (values = {}) => {
    req.sessionModel.get.mockImplementation(key => {
      switch (key) {
        case 'errors':
          return values.errors || []
        case 'answers':
          return values.answers || {}
        default:
          return undefined
      }
    })
  }

  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
    locals: {
      'csrf-token': 'CSRF_TOKEN',
    },
  }

  const next = jest.fn()

  beforeEach(() => {
    req = {
      user,
      body: {},
      sessionModel: {
        set: jest.fn(),
        get: jest.fn(),
      },
      session: {
        assessment: {
          uuid: assessmentUuid,
          episodeUuid,
          subject: { dob: '1980-01-01' },
        },
      },
      form: {
        options: {
          allFields: {},
          fields: {},
          journeyName: 'UPW',
          steps: {
            '/foo': {
              pageTitle: 'Foo task',
            },
          },
        },
        values: {},
      },
    }

    res.render.mockReset()
    req.sessionModel.get.mockReset()
    req.sessionModel.set.mockReset()
    req.form.options.fields = {}
    req.form.options.allFields = {}
    next.mockReset()

    getTaskList.mockReset()
    getAnswers.mockReset()
  })

  it('sets the page description', () => {
    controller.locals(req, res, next)

    expect(res.locals.pageDescription).toBeDefined()
  })

  it('it creates a task list and stores in locals', async () => {
    const answers = {
      foo: 'bar',
    }

    getAnswers.mockReturnValueOnce({
      answers: {},
      tables: {},
    })

    getTaskList.mockReturnValue('FOO TASK LIST')
    mockSessionModel({ answers })

    await controller.locals(req, res, next)

    expect(getTaskList).toHaveBeenCalledWith('/UPW', req.form.options.steps, answers)
    expect(res.locals.taskList).toBe('FOO TASK LIST')
  })
})
