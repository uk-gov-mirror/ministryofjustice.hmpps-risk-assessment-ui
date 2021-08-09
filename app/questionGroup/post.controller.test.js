const { saveQuestionGroup } = require('./post.controller')
const { displayQuestionGroup } = require('./get.controller')
const { assembleDates } = require('../../common/middleware/questionGroups/postHandlers')
const { postAnswers } = require('../../common/data/hmppsAssessmentApi')
const { cachePredictorScoresForEpisode } = require('../../common/data/predictorScores')
const questionGroupPointer = require('../../wiremock/responses/questionGroups.json')[
  '22222222-2222-2222-2222-222222222203'
]

jest.mock('../../common/data/hmppsAssessmentApi')
jest.mock('./get.controller', () => ({
  displayQuestionGroup: jest.fn(),
}))
jest.mock('../../common/data/predictorScores', () => ({
  cachePredictorScoresForEpisode: jest.fn(),
}))

let req
const user = { token: 'mytoken', id: '1' }
const episodeUuid = '22222222-2222-2222-2222-222222222222'
const predictors = [
  {
    date: new Date().toISOString(),
    scores: [{ type: 'RSR', score: 'MEDIUM' }],
  },
]

describe('post answers', () => {
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
    locals: {
      questionGroup: questionGroupPointer.contents[0],
      navigation: { next: { url: 'my/next/page' } },
    },
  }

  beforeEach(() => {
    req = {
      params: {
        assessmentId: 'test-assessment-id',
        groupId: '22222222-2222-2222-2222-222222222204',
        subgroup: 0,
      },
      user,
      body: {},
    }

    displayQuestionGroup.mockReset()
    cachePredictorScoresForEpisode.mockReset()
    res.render.mockReset()
  })

  it('should save the answers', async () => {
    postAnswers.mockResolvedValue([true, { episodeUuid, predictors }])
    cachePredictorScoresForEpisode.mockResolvedValue()

    req.body = {
      '11111111-1111-1111-1111-111111111202': 'Hello',
      '11111111-1111-1111-1111-111111111201': 'there',
    }

    await saveQuestionGroup(req, res)

    expect(postAnswers).toHaveBeenCalledWith(
      'test-assessment-id',
      'current',
      {
        answers: {
          '11111111-1111-1111-1111-111111111201': 'there',
          '11111111-1111-1111-1111-111111111202': 'Hello',
        },
      },
      user.token,
      user.id,
    )
    expect(cachePredictorScoresForEpisode).toHaveBeenCalledWith(episodeUuid, predictors)
    expect(res.redirect).toHaveBeenCalledWith('/test-assessment-id/questiongroup/my/next/page')
  })

  it('should save the answers correctly when there are dates in the body', async () => {
    postAnswers.mockResolvedValue([true, { episodeUuid, predictors }])
    cachePredictorScoresForEpisode.mockResolvedValue()

    req.body = {
      '11111111-1111-1111-1111-111111111205-day': '3',
      '11111111-1111-1111-1111-111111111205-month': '11',
      '11111111-1111-1111-1111-111111111205-year': '2011',
      '11111111-1111-1111-1111-111111111202': 'Hello',
      '11111111-1111-1111-1111-111111111201': 'there',
      '11111111-1111-1111-1111-111111111203-day': '21',
      '11111111-1111-1111-1111-111111111203-month': '2',
      '11111111-1111-1111-1111-111111111203-year': '2020',
      '11111111-1111-1111-1111-111111111209-day': '21',
      '11111111-1111-1111-1111-111111111209-month': '',
      '11111111-1111-1111-1111-111111111209-year': '2020',
    }

    await assembleDates(req, res, () => {})
    await saveQuestionGroup(req, res)

    expect(postAnswers).toHaveBeenCalledWith(
      'test-assessment-id',
      'current',
      {
        answers: {
          '11111111-1111-1111-1111-111111111201': 'there',
          '11111111-1111-1111-1111-111111111202': 'Hello',
          '11111111-1111-1111-1111-111111111203': '2020-02-21T00:00:00.000Z',
          '11111111-1111-1111-1111-111111111205': '2011-11-03T00:00:00.000Z',
          '11111111-1111-1111-1111-111111111209': '',
        },
      },
      user.token,
      user.id,
    )
    expect(cachePredictorScoresForEpisode).toHaveBeenCalledWith(episodeUuid, predictors)
    expect(res.redirect).toHaveBeenCalledWith('/test-assessment-id/questiongroup/my/next/page')
  })

  it('should render form validation errors', async () => {
    postAnswers.mockResolvedValue([false, { status: 422, errors: [], pageErrors: [] }])

    await saveQuestionGroup(req, res)

    expect(cachePredictorScoresForEpisode).not.toHaveBeenCalled()
    expect(displayQuestionGroup).toHaveBeenCalledWith(req, res)
  })

  it('renders an error when the user does not have permission to update the assessment', async () => {
    postAnswers.mockResolvedValue([false, { status: 403, reason: 'OASYS_PERMISSION' }])

    await saveQuestionGroup(req, res)

    const theError =
      'You do not have permission to update this type of assessment. Speak to your manager and ask them to request a change to your level of authorisation.'

    expect(res.render).toHaveBeenCalledWith('app/error', { subHeading: theError })
  })

  it('should display an error if answer saving fails', async () => {
    const theError = new Error('Error message')
    postAnswers.mockRejectedValue(theError)

    await saveQuestionGroup(req, res)

    expect(cachePredictorScoresForEpisode).not.toHaveBeenCalled()
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
