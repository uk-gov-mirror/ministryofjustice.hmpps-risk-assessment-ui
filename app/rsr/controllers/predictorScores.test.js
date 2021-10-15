const PredictorScores = require('./predictorScores')
const { getDraftPredictorScore, postCompleteAssessment } = require('../../../common/data/hmppsAssessmentApi')

jest.mock('../../../common/data/hmppsAssessmentApi')

let req
const user = { token: 'mytoken', id: '1' }
const assessmentUuid = '22222222-2222-2222-2222-222222222221'
const episodeUuid = '22222222-2222-2222-2222-222222222222'

const controller = new PredictorScores({
  route: 'test-route',
})

describe('PredictorScores', () => {
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
        unset: jest.fn(),
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
    req.sessionModel.unset.mockReset()
    req.form.options.fields = {}
    req.form.options.allFields = {}
    next.mockReset()

    getDraftPredictorScore.mockReset()
    postCompleteAssessment.mockReset()
  })

  it('completes an assessment', async () => {
    postCompleteAssessment.mockResolvedValue([true, {}])

    await controller.saveValues(req, res, next)

    expect(postCompleteAssessment).toHaveBeenCalledWith(assessmentUuid, req.user.token, req.user.id)
  })

  it('displays an error when unable to complete an assessment', async () => {
    postCompleteAssessment.mockResolvedValue([false, { reason: 'OASYS_PERMISSION' }])

    await controller.saveValues(req, res, next)

    expect(res.render).toHaveBeenCalledWith('app/error', expect.anything())
  })

  it('displays an error when caught', async () => {
    postCompleteAssessment.mockRejectedValue(new Error())

    await controller.saveValues(req, res, next)

    expect(res.render).toHaveBeenCalledWith('app/error', expect.anything())
  })
})
