// Initialise nunjucks environment
const { configure } = require('nunjucks')

const nunjucksEnvironment = configure({}, {})
const dateFilter = require('nunjucks-date-filter')
const { encodeHTML } = require('../../common/utils/util')
const { mojDate } = require('../../node_modules/@ministryofjustice/frontend/moj/filters/all.js')()
// add custom nunjucks filters
nunjucksEnvironment.addFilter('date', dateFilter)
nunjucksEnvironment.addFilter('mojDate', mojDate)
nunjucksEnvironment.addFilter('encodeHtml', str => encodeHTML(str))

const { displayQuestionGroup } = require('./get.controller')
const { getQuestionGroup, getAnswers } = require('../../common/data/assessmentApi')
const questionGroupPointer = require('../../wiremock/responses/questionGroups.json')[
  '22222222-2222-2222-2222-222222222203'
]
const expected = require('./fixtures/expected.json')

jest.mock('../../common/data/assessmentApi')

const tokens = { authorisationToken: 'mytoken' }
let questionGroup
let expectedForThisTest

describe('display question group and answers', () => {
  const req = {
    body: {},
    tokens,
    params: {
      assessmentId: 'test-assessment-id',
      groupId: '22222222-2222-2222-2222-222222222203',
      subgroup: 0,
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
    questionGroup = JSON.parse(JSON.stringify(questionGroupPointer))
    expectedForThisTest = JSON.parse(JSON.stringify(expected))
    req.params.subgroup = 0
    getQuestionGroup.mockReset()
    getAnswers.mockReset()
  })

  it('should render the page with the correct structure', async () => {
    getQuestionGroup.mockReturnValueOnce(questionGroup)
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
    expectedWithAnswers.questions[0].contents[0].answer = forenameAnswer
    expectedWithAnswers.questions[0].contents[1].answer = surnameAnswer
    getQuestionGroup.mockReturnValueOnce(questionGroup)
    getAnswers.mockReturnValueOnce({
      answers: {
        '11111111-1111-1111-1111-111111111201': {
          freeTextAnswer: surnameAnswer,
        },
        '11111111-1111-1111-1111-111111111202': {
          freeTextAnswer: forenameAnswer,
        },
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
    getQuestionGroup.mockReturnValueOnce(questionGroup)
    await displayQuestionGroup(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })

  it('should throw an error if it cannot retrieve question group', async () => {
    const theError = new Error('Question group error message')
    getQuestionGroup.mockImplementation(() => {
      throw theError
    })
    await displayQuestionGroup(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })

  it('should redirect to assessments page if high subIndex is requested', async () => {
    req.params.subgroup = 3
    getQuestionGroup.mockReturnValueOnce(questionGroup)
    await displayQuestionGroup(req, res)
    expect(res.redirect).toHaveBeenCalledWith('/test-assessment-id/assessments')
  })
})
