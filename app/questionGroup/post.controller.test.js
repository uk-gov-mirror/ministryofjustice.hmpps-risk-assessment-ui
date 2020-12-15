const { saveQuestionGroup } = require('./post.controller')
const { postAnswers } = require('../../common/data/assessmentApi')

jest.mock('../../common/data/assessmentApi')

let req
const tokens = { authorisationToken: 'mytoken' }

beforeEach(() => {
  req = {
    params: {
      assessmentId: 'test-assessment-id',
      groupId: '22222222-2222-2222-2222-222222222203',
      subgroup: 0,
    },
    tokens,
    body: {},
  }
})

describe('post answers', () => {
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }

  it('should save the answers', async () => {
    req.body = {
      'id-11111111-1111-1111-1111-111111111202': 'Hello',
      'id-11111111-1111-1111-1111-111111111201': 'there',
    }
    await saveQuestionGroup(req, res)
    expect(postAnswers).toHaveBeenCalledWith(
      'test-assessment-id',
      '4511a3f6-7f51-4b96-b603-4e75eac0c839',
      {
        answers: {
          '11111111-1111-1111-1111-111111111201': {
            answers: {},
            freeTextAnswer: 'there',
          },
          '11111111-1111-1111-1111-111111111202': {
            answers: {},
            freeTextAnswer: 'Hello',
          },
        },
      },
      tokens,
    )
    expect(res.redirect).toHaveBeenCalledWith(
      '/test-assessment-id/questionGroup/22222222-2222-2222-2222-222222222203/1',
    )
  })

  it('should save the answers correctly when there are dates in the body', async () => {
    req.body = {
      'id-11111111-1111-1111-1111-111111111206-day': '3',
      'id-11111111-1111-1111-1111-111111111206-month': '11',
      'id-11111111-1111-1111-1111-111111111206-year': '2011',
      'id-11111111-1111-1111-1111-111111111202': 'Hello',
      'id-11111111-1111-1111-1111-111111111201': 'there',
      'id-11111111-1111-1111-1111-111111111203-day': '21',
      'id-11111111-1111-1111-1111-111111111203-month': '2',
      'id-11111111-1111-1111-1111-111111111203-year': '2020',
      'id-11111111-1111-1111-1111-111111111209-day': '21',
      'id-11111111-1111-1111-1111-111111111209-month': '',
      'id-11111111-1111-1111-1111-111111111209-year': '2020',
    }
    await saveQuestionGroup(req, res)
    expect(postAnswers).toHaveBeenCalledWith(
      'test-assessment-id',
      '4511a3f6-7f51-4b96-b603-4e75eac0c839',
      {
        answers: {
          '11111111-1111-1111-1111-111111111201': {
            answers: {},
            freeTextAnswer: 'there',
          },
          '11111111-1111-1111-1111-111111111202': {
            answers: {},
            freeTextAnswer: 'Hello',
          },
          '11111111-1111-1111-1111-111111111203': {
            answers: {},
            freeTextAnswer: '2020-02-21T00:00:00.000Z',
          },
          '11111111-1111-1111-1111-111111111206': {
            answers: {},
            freeTextAnswer: '2011-11-03T00:00:00.000Z',
          },
          '11111111-1111-1111-1111-111111111209': {
            answers: {},
            freeTextAnswer: '',
          },
        },
      },
      tokens,
    )
    expect(res.redirect).toHaveBeenCalledWith(
      '/test-assessment-id/questionGroup/22222222-2222-2222-2222-222222222203/1',
    )
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
