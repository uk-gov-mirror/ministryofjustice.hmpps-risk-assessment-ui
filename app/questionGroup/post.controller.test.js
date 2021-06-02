const { saveQuestionGroup } = require('./post.controller')
const { assembleDates } = require('../../common/question-groups/post-question-groups')
const { postAnswers } = require('../../common/data/hmppsAssessmentApi')
const questionGroupPointer = require('../../wiremock/responses/questionGroups.json')[
  '22222222-2222-2222-2222-222222222203'
]

jest.mock('../../common/data/hmppsAssessmentApi')

let req
const user = { token: 'mytoken', id: '1' }

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
})

describe('post answers', () => {
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
    locals: {
      questionGroup: questionGroupPointer.contents[0],
      navigation: { next: { url: 'my/next/page' } },
    },
  }

  it('should save the answers', async () => {
    postAnswers.mockImplementation(() => {
      return [true, {}]
    })

    req.body = {
      'id-11111111-1111-1111-1111-111111111202': 'Hello',
      'id-11111111-1111-1111-1111-111111111201': 'there',
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
    expect(res.redirect).toHaveBeenCalledWith('/test-assessment-id/questiongroup/my/next/page')
  })

  it('should save the answers correctly when there are dates in the body', async () => {
    postAnswers.mockImplementation(() => {
      return [true, {}]
    })
    req.body = {
      'id-11111111-1111-1111-1111-111111111205-day': '3',
      'id-11111111-1111-1111-1111-111111111205-month': '11',
      'id-11111111-1111-1111-1111-111111111205-year': '2011',
      'id-11111111-1111-1111-1111-111111111202': 'Hello',
      'id-11111111-1111-1111-1111-111111111201': 'there',
      'id-11111111-1111-1111-1111-111111111203-day': '21',
      'id-11111111-1111-1111-1111-111111111203-month': '2',
      'id-11111111-1111-1111-1111-111111111203-year': '2020',
      'id-11111111-1111-1111-1111-111111111209-day': '21',
      'id-11111111-1111-1111-1111-111111111209-month': '',
      'id-11111111-1111-1111-1111-111111111209-year': '2020',
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
    expect(res.redirect).toHaveBeenCalledWith('/test-assessment-id/questiongroup/my/next/page')
  })

  it('should display an error if answer saving fails', async () => {
    const theError = new Error('Error message')
    postAnswers.mockImplementation(() => {
      throw theError
    })
    await saveQuestionGroup(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
