const { displayPredictorScores } = require('./get.controller')
const { postCompleteAssessment } = require('../../common/data/hmppsAssessmentApi')

jest.mock('../../common/data/hmppsAssessmentApi', () => ({
  postCompleteAssessment: jest.fn(),
}))

const assessmentUuid = '22222222-2222-2222-2222-222222222221'
const episodeUuid = '22222222-2222-2222-2222-222222222222'
const user = {
  id: 'USER_ID',
  token: 'USER_TOKEN',
}

const predictorScores = {
  RSR: { level: 'HIGH', score: 11.34, isValid: true, date: '2021-07-23T12:00' },
  'OSP/C': { level: 'MEDIUM', score: 8.76, isValid: true, date: '2021-07-23T12:00' },
  'OSP/I': { level: 'LOW', score: 3.45, isValid: true, date: '2021-07-23T12:00' },
}

const formattedCurrentPredictorScore = {
  date: '23 Jul 2021 at 12:00',
  scores: {
    RSR: { type: 'RSR', level: 'HIGH', score: 11.34 },
    OSPC: { type: 'OSP/C', level: 'MEDIUM', score: 8.76 },
    OSPI: { type: 'OSP/I', level: 'LOW', score: 3.45 },
  },
}

const formattedHistoricalPredictorScores = []

describe('display predictor scores', () => {
  const req = {
    params: {
      episodeUuid,
      assessmentUuid,
      assessmentType: 'RSR',
    },
    session: {
      navigation: {
        previousPage: {
          url: '/foo/bar',
          name: 'previous page',
        },
      },
    },
    user,
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
    postCompleteAssessment.mockReset()
  })

  it('displays predictor scores', async () => {
    postCompleteAssessment.mockResolvedValue([true, { predictors: predictorScores }])

    await displayPredictorScores(req, res)

    expect(postCompleteAssessment).toHaveBeenCalledWith(assessmentUuid, user.token, user.id)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, {
      subheading: 'Risk of Serious Recidivism (RSR) assessment',
      heading: "Bob Ross's scores",
      navigation: {
        previous: {
          name: 'previous page',
          url: '/foo/bar',
        },
        complete: {
          url: '/22222222-2222-2222-2222-222222222221/episode/22222222-2222-2222-2222-222222222222/RSR/scores/complete',
        },
      },
      predictorScores: {
        current: formattedCurrentPredictorScore,
        historical: formattedHistoricalPredictorScores,
      },
    })
  })

  it('catches exceptions and renders the error page', async () => {
    const theError = new Error('💥')
    postCompleteAssessment.mockRejectedValue(theError)

    await displayPredictorScores(req, res)

    expect(postCompleteAssessment).toHaveBeenCalled()
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
