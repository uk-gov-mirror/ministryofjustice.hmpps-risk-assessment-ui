// Initialise nunjucks environment
const { displayOverview } = require('./get.controller')
const { getQuestionGroupSummary } = require('../../common/data/assessmentApi')
const questionGroupSummaryPointer = require('../../wiremock/responses/questionGroups.json')[
  '7a6836c1-2caf-4a0d-8e5c-5d13482a868f'
]
const expected = require('./fixtures/expected.json')

jest.mock('../../common/data/assessmentApi')

const tokens = { authorisationToken: 'mytoken' }
let questionGroupSummary
let expectedForThisTest

describe('display question group summary', () => {
  const req = {
    body: {},
    tokens,
    params: {
      assessmentId: 'test-assessment-id',
      groupId: '7a6836c1-2caf-4a0d-8e5c-5d13482a868f',
    },
  }
  const res = {
    render: jest.fn(),
    redirect: jest.fn(),
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
