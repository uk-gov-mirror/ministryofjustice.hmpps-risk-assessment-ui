const DeleteItemController = require('./removeMultipleGroupItem')
const { getAnswers, postAnswers } = require('../../../common/data/hmppsAssessmentApi')
const { CACHE } = require('../../../common/utils/constants')

jest.mock('../../../common/data/hmppsAssessmentApi')

let req
let res
const user = { token: 'mytoken', id: '1' }
const assessmentUuid = '22222222-2222-2222-2222-222222222221'
const episodeUuid = '22222222-2222-2222-2222-222222222222'

const controller = new DeleteItemController({
  route: 'test-route',
})

describe('removeMultipleGroupItem (UPW)', () => {
  const mockSessionModel = (values = {}) => {
    req.sessionModel.get.mockImplementation((key) => {
      switch (key) {
        case CACHE.ERRORS:
          return values.errors || []
        case CACHE.SUBMITTED_ANSWERS:
          return values.submittedAnswers || {}
        default:
          return undefined
      }
    })
  }

  const next = jest.fn()

  beforeEach(() => {
    req = {
      params: [],
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
    res = {
      redirect: jest.fn(),
      render: jest.fn(),
      locals: {
        'csrf-token': 'CSRF_TOKEN',
      },
    }

    res.render.mockReset()
    req.sessionModel.get.mockReset()
    req.sessionModel.set.mockReset()
    req.form.options.fields = {}
    req.form.options.allFields = {}
    getAnswers.mockReset()
    postAnswers.mockReset()
    getAnswers.mockResolvedValue({ answers: {} })
    next.mockReset()
  })

  it('it saves the updated multiple group', async () => {
    mockSessionModel({
      submittedAnswers: {
        foo: 'bar',
      },
    })

    res.locals.multipleGroupName = 'my_multiple_group'
    req.params = [1]

    getAnswers.mockResolvedValue({
      answers: {
        first_question: ['PREVIOUS_FOO'],
        my_multiple_group: [{ myFirstItem: 'first ' }, { mySecondItem: 'second' }, { myThirdItem: 'third' }],
        third_question: ['PREVIOUS_BAR'],
      },
    })

    const expectedPayload = {
      answers: {
        my_multiple_group: [{ myFirstItem: 'first ' }, { myThirdItem: 'third' }],
      },
    }

    postAnswers.mockResolvedValue([true, {}])

    await controller.locals(req, res, next)

    expect(postAnswers).toHaveBeenCalledWith(
      req.session.assessment.uuid,
      req.session.assessment.episodeUuid,
      expectedPayload,
      req.user.token,
      req.user.id,
    )

    expect(req.sessionModel.set).toHaveBeenCalledWith(CACHE.PERSISTED_ANSWERS, {
      first_question: ['PREVIOUS_FOO'],
      my_multiple_group: [{ myFirstItem: 'first ' }, { myThirdItem: 'third' }],
      third_question: ['PREVIOUS_BAR'],
    })
  })
})
