const { submitPredictorScores } = require('./get.controller')

describe('display predictor scores', () => {
  const req = {
    params: {
      episodeUuid: '22222222-2222-2222-2222-222222222222',
      assessmentType: 'RSR',
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

  it('displays a message on submission', async () => {
    await submitPredictorScores(req, res)

    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, {
      panelText: 'Your answers and scores for Bob Ross have been uploaded to OASys',
      navigation: {
        next: {
          url: '/',
        },
      },
    })
  })
})
