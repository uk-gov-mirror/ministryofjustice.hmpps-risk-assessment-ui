// Initialise nunjucks environment
const { displayOverview } = require('./get.controller')
const { getQuestionGroupSummary } = require('../../common/data/hmppsAssessmentApi')
const questionGroupSummaryPointer = require('../../wiremock/responses/questionGroups.json').pre_sentence_assessment
const expected = require('./fixtures/expected.json')

jest.mock('../../common/data/hmppsAssessmentApi')

const user = { token: 'mytoken', id: '1' }
let questionGroupSummary
let expectedForThisTest

describe('display question group summary', () => {
  const req = {
    body: {},
    user,
    params: {
      assessmentId: 'test-assessment-id',
      groupId: '65a3924c-4130-4140-b7f4-cc39a52603bb',
    },
  }
  const res = {
    render: jest.fn(),
    redirect: jest.fn(),
    locals: {
      offenderDetails: {
        name: 'Fred Smith',
      },
    },
  }

  beforeEach(() => {
    questionGroupSummary = JSON.parse(JSON.stringify(questionGroupSummaryPointer))
    expectedForThisTest = JSON.parse(JSON.stringify(expected))
    req.params.subgroup = 0
    getQuestionGroupSummary.mockReset()
  })

  it('should render the page with the correct structure', async () => {
    getQuestionGroupSummary.mockReturnValueOnce(questionGroupSummary)

    await displayOverview(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expectedForThisTest)
  })

  it('should throw an error if it cannot retrieve question group summary', async () => {
    const theError = new Error('Question group error message')
    getQuestionGroupSummary.mockImplementation(() => {
      throw theError
    })
    await displayOverview(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
