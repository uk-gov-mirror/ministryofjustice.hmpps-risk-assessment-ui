const { postCompleteAssessment } = require('../../common/data/hmppsAssessmentApi')
const { submitPredictorScores } = require('./get.controller')

jest.mock('../../common/data/hmppsAssessmentApi', () => ({
  postCompleteAssessment: jest.fn(),
}))

describe('display predictor scores', () => {
  const req = {
    params: {
      assessmentId: '22222222-2222-2222-2222-222222222222',
      episodeId: '22222222-2222-2222-2222-222222222222',
      assessmentType: 'RSR',
    },
    user: {
      id: 'USER_ID',
      token: 'USER_TOKEN',
    },
  }
  const res = {
    render: jest.fn(),
    redirect: jest.fn(),
    locals: {
      offenderDetails: {
        name: 'Bob Ross',
      },
    },
  }

  beforeEach(() => {
    res.render.mockReset()
    postCompleteAssessment.mockReset()
  })

  it('displays a message on submission', async () => {
    postCompleteAssessment.mockResolvedValue([true])

    await submitPredictorScores(req, res)

    expect(postCompleteAssessment).toHaveBeenCalledWith(req.params.assessmentId, req.user.token, req.user.id)

    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, {
      panelText: 'Your answers and scores for Bob Ross have been uploaded to OASys',
      navigation: {
        next: {
          url: '/',
        },
      },
    })
  })

  it('displays a message when failed to complete an assessment', async () => {
    postCompleteAssessment.mockResolvedValue([false])

    await submitPredictorScores(req, res)

    expect(postCompleteAssessment).toHaveBeenCalledWith(req.params.assessmentId, req.user.token, req.user.id)

    expect(res.render).toHaveBeenCalledWith('app/error', {
      error: new Error('Failed to complete the assessment'),
    })
  })
})
