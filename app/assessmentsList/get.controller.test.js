const { displayAssessmentsList } = require('./get.controller')
const { getAssessmentsList } = require('../../common/data/hmppsAssessmentApi')
const questionList = require('../../wiremock/responses/questionList.json')

jest.mock('../../common/data/hmppsAssessmentApi')

const user = { token: 'mytoken', id: '1' }

describe('getFormsList', () => {
  const req = {
    params: {
      assessmentId: 'test-assessment-id',
    },
    user,
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
          path: '/test-assessment-id/questionGroup/22222222-2222-2222-2222-222222222203/summary',
        },
        {
          groupId: '22222222-2222-2222-2222-222222222201',
          title: 'Long Form',
          contentCount: 3,
          groupCount: 0,
          questionCount: 0,
          path: '/test-assessment-id/questionGroup/22222222-2222-2222-2222-222222222201/summary',
        },
        {
          groupId: '22222222-2222-2222-2222-222222222240',
          title: 'Overview',
          contentCount: 1,
          groupCount: 0,
          questionCount: 0,
          path: '/test-assessment-id/questionGroup/22222222-2222-2222-2222-222222222240/summary',
        },
        {
          contentCount: 12,
          groupCount: 0,
          groupId: '65a3924c-4130-4140-b7f4-cc39a52603bb',
          path: '/test-assessment-id/questionGroup/65a3924c-4130-4140-b7f4-cc39a52603bb/summary',
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
