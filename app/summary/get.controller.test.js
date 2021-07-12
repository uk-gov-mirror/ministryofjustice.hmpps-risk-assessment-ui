// Initialise nunjucks environment
const { displayOverview } = require('./get.controller')
const { getAssessmentSummary } = require('../../common/data/hmppsAssessmentApi')
const assessmentSummaryPointer = require('../../wiremock/responses/questionGroupSummary.json').ROSH
const expected = require('./fixtures/expected.json')

jest.mock('../../common/data/hmppsAssessmentApi')

const user = { token: 'mytoken', id: '1' }
let assessmentSummary
let expectedForThisTest

describe('display question group summary', () => {
  const req = {
    body: {},
    user,
    params: {
      assessmentId: 'test-assessment-id',
      assessmentType: 'ROSH',
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
    assessmentSummary = JSON.parse(JSON.stringify(assessmentSummaryPointer))
    expectedForThisTest = JSON.parse(JSON.stringify(expected))
    req.params.subgroup = 0
    getAssessmentSummary.mockReset()
  })

  it('should render the page with the correct structure', async () => {
    getAssessmentSummary.mockReturnValueOnce(assessmentSummary)

    await displayOverview(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expectedForThisTest)
  })

  it('should throw an error if it cannot retrieve question group summary', async () => {
    const theError = new Error('Question group error message')
    getAssessmentSummary.mockImplementation(() => {
      throw theError
    })
    await displayOverview(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
