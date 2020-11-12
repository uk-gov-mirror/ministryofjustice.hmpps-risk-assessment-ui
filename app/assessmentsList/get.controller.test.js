const { displayAssessmentsList } = require('./get.controller')
const { getAssessmentsList } = require('../../common/data/assessmentApi')
const questionList = require('../../wiremock/responses/questionList.json')

jest.mock('../../common/data/assessmentApi')

const tokens = { authorisationToken: 'mytoken' }

describe('getFormsList', () => {
  const req = {
    tokens,
  }
  const res = {
    render: jest.fn(),
  }

  beforeEach(() => {
    getAssessmentsList.mockReset()
  })

  it('should call render with the correct forms', async () => {
    const expected = {
      forms: [
        {
          groupId: '22222222-2222-2222-2222-222222222203',
          title: 'Brief Form',
          contentCount: 1,
          groupCount: 0,
          questionCount: 0,
          path: '/questionGroup/22222222-2222-2222-2222-222222222203/0',
        },
        {
          groupId: '22222222-2222-2222-2222-222222222201',
          title: 'Long Form',
          contentCount: 3,
          groupCount: 0,
          questionCount: 0,
          path: '/questionGroup/22222222-2222-2222-2222-222222222201/0',
        },
        {
          groupId: '22222222-2222-2222-2222-222222222240',
          title: 'Overview',
          contentCount: 1,
          groupCount: 0,
          questionCount: 0,
          path: '/questionGroup/22222222-2222-2222-2222-222222222240/0',
        },
      ],
    }
    getAssessmentsList.mockReturnValueOnce(questionList)
    await displayAssessmentsList(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expected)
  })

  it('should render the error page', async () => {
    const theError = new Error('Error message')
    getAssessmentsList.mockImplementation(() => {
      throw theError
    })
    await displayAssessmentsList(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
