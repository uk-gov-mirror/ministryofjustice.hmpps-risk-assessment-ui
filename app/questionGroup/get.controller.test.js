// Initialise nunjucks environment
const { configure } = require('nunjucks')

const nunjucksEnvironment = configure({}, {})
const dateFilter = require('nunjucks-date-filter')
const { encodeHTML } = require('../../common/utils/util')
const { mojDate } = require('../../node_modules/@ministryofjustice/frontend/moj/filters/all')()
// add custom nunjucks filters
nunjucksEnvironment.addFilter('date', dateFilter)
nunjucksEnvironment.addFilter('mojDate', mojDate)
nunjucksEnvironment.addFilter('encodeHtml', str => encodeHTML(str))

const { displayQuestionGroup } = require('./get.controller')
const { getAnswers } = require('../../common/data/hmppsAssessmentApi')
const questionGroupPointer = require('../../wiremock/responses/questionGroups.json')[
  '22222222-2222-2222-2222-222222222203'
].contents[0].contents[0]
const expected = require('./fixtures/expected.json')

jest.mock('../../common/data/hmppsAssessmentApi')

const user = { token: 'mytoken', id: '1' }
let expectedForThisTest

describe('display question group and answers', () => {
  const req = {
    body: {},
    user,
    params: {
      assessmentId: 'test-assessment-id',
      groupId: '22222222-2222-2222-2222-222222222204',
      subgroup: 0,
      page: 0,
    },
  }
  const res = {
    render: jest.fn(),
    redirect: jest.fn(),
    locals: {
      offenderDetails: {
        name: 'Fred Smith',
      },
      questionGroup: questionGroupPointer,
    },
  }

  beforeEach(() => {
    res.locals.questionGroup = JSON.parse(JSON.stringify(questionGroupPointer))
    expectedForThisTest = JSON.parse(JSON.stringify(expected))
    req.params.subgroup = 0
    getAnswers.mockReset()
    res.render.mockReset()
  })

  it('should render the page with the correct structure', async () => {
    getAnswers.mockReturnValueOnce({
      answers: {},
    })
    await displayQuestionGroup(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expectedForThisTest)
  })

  it('should mix in answers when available', async () => {
    const expectedWithAnswers = JSON.parse(JSON.stringify(expectedForThisTest))
    const forenameAnswer = 'Bob'
    const surnameAnswer = 'Mould'
    expectedWithAnswers.questions[0].answer = forenameAnswer
    expectedWithAnswers.questions[1].answer = surnameAnswer
    getAnswers.mockReturnValueOnce({
      answers: {
        surname: [surnameAnswer],
        forename: [forenameAnswer],
      },
    })
    await displayQuestionGroup(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expectedWithAnswers)
  })

  it('should default answers where not available', async () => {
    const expectedWithAnswers = JSON.parse(JSON.stringify(expectedForThisTest))
    expectedWithAnswers.questions[0].answer = ''
    expectedWithAnswers.questions[1].answer = ''
    getAnswers.mockReturnValueOnce({
      answers: {
        surname: [],
        forename: [],
      },
    })

    await displayQuestionGroup(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expectedWithAnswers)
  })

  it('should throw an error if it cannot retrieve answers', async () => {
    const theError = new Error('Answers error message')
    getAnswers.mockImplementation(() => {
      throw theError
    })
    await displayQuestionGroup(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })

  it('adds assessment information to the template for use by client-side javascript', async () => {
    getAnswers.mockReturnValueOnce({
      answers: {},
      episodeUuid: 'test-episode-id',
    })
    await displayQuestionGroup(req, res)

    expect(res.locals).toMatchObject({
      assessmentUuid: 'test-assessment-id',
      episodeUuid: 'test-episode-id',
    })
  })
})
