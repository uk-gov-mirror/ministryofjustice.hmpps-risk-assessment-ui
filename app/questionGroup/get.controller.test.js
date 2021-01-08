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

jest.mock('../../common/data/assessmentApi')

const tokens = { authorisationToken: 'mytoken' }
let questionGroup
let expectedForThisTest

const expected = {
  assessmentId: 'test-assessment-id',
  groupId: '22222222-2222-2222-2222-222222222203',
  heading: 'Brief Form',
  last: true,
  questions: [
    {
      answer: null,
      answerSchemas: [],
      answerType: 'freetext',
      displayOrder: '1',
      mandatory: 'no',
      questionCode: 'forename',
      questionId: '11111111-1111-1111-1111-111111111202',
      questionText: 'Forename',
      type: 'question',
    },
    {
      answer: null,
      answerSchemas: [],
      answerType: 'freetext',
      displayOrder: '2',
      mandatory: 'no',
      questionCode: 'surname',
      questionId: '11111111-1111-1111-1111-111111111201',
      questionText: 'Surname',
      type: 'question',
    },
    {
      answer: null,
      answerSchemas: [],
      answerType: 'date',
      displayOrder: '3',
      mandatory: 'no',
      questionCode: 'dob',
      questionId: '11111111-1111-1111-1111-111111111205',
      questionText: 'Date of Birth',
      type: 'question',
    },
    {
      answer: null,
      answerSchemas: [],
      answerType: 'freetext',
      displayOrder: '4',
      mandatory: 'no',
      questionCode: 'gender',
      questionId: '11111111-1111-1111-1111-111111111207',
      questionText: 'Gender',
      type: 'question',
    },
    {
      answer: null,
      answerSchemas: [
        {
          answerSchemaCode: 'SR15.1.2.1',
          answerSchemaUuid: '44444444-4444-4444-4444-444444444444',
          text: 'Yes',
          value: 'Y',
          conditional: {
            html:
              ' <div class="govuk-form-group"><label class="govuk-label Further information govuk-label--m" for="id-conditional-question-id-1111111">Further information</label><div id="id-conditional-question-id-1111111-hint" class="govuk-hint"></div><textarea class="govuk-textarea" id="id-conditional-question-id-1111111" name="id-conditional-question-id-1111111" rows="5" aria-describedby="id-conditional-question-id-1111111-hint"></textarea>\n' +
              '</div>',
          },
        },
        {
          answerSchemaCode: 'SR15.1.2.2',
          answerSchemaUuid: '44444444-4444-4444-4444-444444444445',
          text: 'No',
          value: 'N',
        },
      ],
      answerType: 'radio',
      displayOrder: '1',
      mandatory: 'no',
      questionCode: 'no_fixed_abode',
      questionId: '11111111-1111-1111-1111-111111111231',
      questionText: 'Currently of no fixed abode or in transient accommodation',
      type: 'question',
    },
    {
      answer: null,
      answerSchemas: [
        {
          answerSchemaCode: 'SR15.1.2.1',
          answerSchemaUuid: '44444444-4444-4444-4444-444444444444',
          text: 'Punishment',
          value: 'punishment',
        },
        {
          answerSchemaCode: 'SR15.1.2.1',
          answerSchemaUuid: '44444444-4444-4444-4444-444444444444',
          text: 'Public protection',
          value: 'public_protection',
        },
        {
          answerSchemaCode: 'SR15.1.2.1',
          answerSchemaUuid: '44444444-4444-4444-4444-444444444444',
          text: 'Crime reduction',
          value: 'crime_reduction',
        },
        {
          answerSchemaCode: 'SR15.1.2.1',
          answerSchemaUuid: '44444444-4444-4444-4444-444444444444',
          text: 'Reparation',
          value: 'reparation',
        },
        {
          answerSchemaCode: 'SR15.1.2.1',
          answerSchemaUuid: '44444444-4444-4444-4444-444444444444',
          text: 'Reform or rehabilitation',
          value: 'reform_or_rehabilitation',
        },
      ],
      answerType: 'dropdown',
      displayOrder: '1',
      mandatory: 'no',
      questionCode: 'sentencing_purpose',
      questionId: '11111111-1111-1111-1111-111114111231',
      questionText: 'Sentencing purpose',
      type: 'question',
    },
    {
      answer: null,
      answerSchemas: [],
      answerType: 'textarea',
      displayOrder: '1',
      hint: 'Enter any other relevant information',
      mandatory: 'no',
      questionCode: 'add_info',
      questionId: '11111111-1111-1111-1111-111111111310',
      questionText: 'Additional information',
      type: 'question',
    },
  ],
  subheading: 'Case Identification',
}

describe('display question group and answers', () => {
  const req = {
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
    expectedWithAnswers.questions[0].answer = forenameAnswer
    expectedWithAnswers.questions[1].answer = surnameAnswer
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
