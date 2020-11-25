const { saveQuestionGroup } = require('./post.controller')
const { postAnswers } = require('../../common/data/assessmentApi')

jest.mock('../../common/data/assessmentApi')

let req
const tokens = { authorisationToken: 'mytoken' }

beforeEach(() => {
  req = {
    params: {
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

  it('should save the new objective when there are no errors', async () => {
    req.body = {
      'id-11111111-1111-1111-1111-111111111202': 'Hello',
      'id-11111111-1111-1111-1111-111111111201': 'there',
    }
    await saveQuestionGroup(req, res)
    expect(postAnswers).toHaveBeenCalledWith(
      'e69a61ff-7395-4a12-b434-b1aa6478aded',
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
    expect(res.redirect).toHaveBeenCalledWith('/questionGroup/22222222-2222-2222-2222-222222222203/1')
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
