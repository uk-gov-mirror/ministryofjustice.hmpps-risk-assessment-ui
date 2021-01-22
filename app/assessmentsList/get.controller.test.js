const { displayAssessmentsList } = require('./get.controller')
const { getAssessmentsList } = require('../../common/data/assessmentApi')
const questionList = require('../../wiremock/responses/questionList.json')

jest.mock('../../common/data/assessmentApi')

const tokens = { authorisationToken: 'mytoken' }

describe('getFormsList', () => {
  const req = {
    params: {
      assessmentId: 'test-assessment-id',
    },
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
          path: '/test-assessment-id/questionGroup/22222222-2222-2222-2222-222222222203/0',
        },
        {
          groupId: '22222222-2222-2222-2222-222222222201',
          title: 'Long Form',
          contentCount: 3,
          groupCount: 0,
          questionCount: 0,
          path: '/test-assessment-id/questionGroup/22222222-2222-2222-2222-222222222201/0',
        },
        {
          groupId: '22222222-2222-2222-2222-222222222240',
          title: 'Overview',
          contentCount: 1,
          groupCount: 0,
          questionCount: 0,
          path: '/test-assessment-id/questionGroup/22222222-2222-2222-2222-222222222240/0',
        },
        {
          contentCount: 12,
          groupCount: 0,
          groupId: 'b7e505fa-0de8-47ee-a207-c23f65782cb4',
          path: '/test-assessment-id/questionGroup/b7e505fa-0de8-47ee-a207-c23f65782cb4/0',
          questionCount: 0,
          title: 'Short pre sentence assessment',
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
