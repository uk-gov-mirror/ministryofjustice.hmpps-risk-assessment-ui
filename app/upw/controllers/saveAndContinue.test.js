const SaveAndContinue = require('./saveAndContinue')

let req
const user = { token: 'mytoken', id: '1' }
const assessmentUuid = '22222222-2222-2222-2222-222222222221'
const episodeUuid = '22222222-2222-2222-2222-222222222222'

const controller = new SaveAndContinue({
  route: 'test-route',
})

describe('SaveAndContinueController (UPW)', () => {
  const mockSessionModel = (values = {}) => {
    req.sessionModel.get.mockImplementation(key => {
      switch (key) {
        case 'errors':
          return values.errors || []
        case 'formAnswers':
          return values.formAnswers || {}
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

  it('it invalidates declarations when saving', () => {
    mockSessionModel({
      formAnswers: {
        declaration: 'COMPLETED',
        foo: 'bar',
      },
    })

    controller.saveValues(req, res, next)

    expect(req.sessionModel.set).toHaveBeenCalledWith('answers', {
      declaration: '',
      foo: 'bar',
    })
  })
})
