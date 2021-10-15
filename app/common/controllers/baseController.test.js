const BaseController = require('./baseController')

let req
const user = { token: 'mytoken', id: '1' }
const assessmentUuid = '22222222-2222-2222-2222-222222222221'
const episodeUuid = '22222222-2222-2222-2222-222222222222'

const controller = new BaseController({
  route: 'test-route',
})

describe('BaseController', () => {
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
  })

  it('puts the CSRF token in the locals', () => {
    controller.locals(req, res, next)

    expect(res.locals.csrfToken).toBe('CSRF_TOKEN')
  })

  it('puts the assessment in locals from the session', () => {
    controller.locals(req, res, next)

    expect(res.locals.assessment).toStrictEqual(req.session.assessment)
  })
})
