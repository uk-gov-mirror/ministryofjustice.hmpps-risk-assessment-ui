const { displayPredictorScores } = require('./get.controller')
const { getPredictorScoresForEpisode } = require('../../common/data/predictorScores')

jest.mock('../../common/data/predictorScores', () => ({
  getPredictorScoresForEpisode: jest.fn(),
}))

const episodeUuid = '22222222-2222-2222-2222-222222222222'

const predictorScores = [
  {
    type: 'RSR',
    scores: [
      { level: 'HIGH', score: 11.34, isValid: true, date: '2021-07-23T12:00' },
      { level: 'HIGH', score: 11.34, isValid: true, date: '2021-07-22T12:00' },
    ],
  },
  {
    type: 'OSP/C',
    scores: [
      { level: 'MEDIUM', score: 8.76, isValid: true, date: '2021-07-23T12:00' },
      { level: 'MEDIUM', score: 8.76, isValid: true, date: '2021-07-22T12:00' },
    ],
  },
  {
    type: 'OSP/I',
    scores: [
      { level: 'LOW', score: 3.45, isValid: true, date: '2021-07-23T12:00' },
      { level: 'LOW', score: 3.45, isValid: true, date: '2021-07-22T12:00' },
    ],
  },
]

const formattedCurrentPredictorScore = {
  date: '23 Jul 2021 at 12:00',
  scores: {
    RSR: { type: 'RSR', level: 'HIGH', score: 11.34 },
    OSPC: { type: 'OSP/C', level: 'MEDIUM', score: 8.76 },
    OSPI: { type: 'OSP/I', level: 'LOW', score: 3.45 },
  },
}

const formattedHistoricalPredictorScores = [
  {
    date: '22 Jul 2021 at 12:00',
    scores: {
      RSR: { type: 'RSR', level: 'HIGH', score: 11.34 },
      OSPC: { type: 'OSP/C', level: 'MEDIUM', score: 8.76 },
      OSPI: { type: 'OSP/I', level: 'LOW', score: 3.45 },
    },
  },
]

describe('display predictor scores', () => {
  const req = {
    params: {
      episodeUuid: '22222222-2222-2222-2222-222222222222',
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
    getPredictorScoresForEpisode.mockReset()
  })

  it('displays predictor scores', async () => {
    getPredictorScoresForEpisode.mockResolvedValue(predictorScores)

    await displayPredictorScores(req, res)

    expect(getPredictorScoresForEpisode).toHaveBeenCalledWith(episodeUuid)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, {
      subheading: 'Risk of Serious Recidivism (RSR) assessment',
      heading: "Bob Ross's scores",
      navigation: {
        previous: {
          name: 'previous page',
          url: '/foo/bar',
        },
        complete: {
          url: '/episode/22222222-2222-2222-2222-222222222222/RSR/scores/complete',
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
    getPredictorScoresForEpisode.mockRejectedValue(theError)

    await displayPredictorScores(req, res)

    expect(getPredictorScoresForEpisode).toHaveBeenCalled()
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
