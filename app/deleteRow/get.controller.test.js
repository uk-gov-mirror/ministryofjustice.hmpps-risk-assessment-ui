const { displayDeleteRow } = require('./get.controller')
const { getAnswers } = require('../../common/data/hmppsAssessmentApi')
const questionGroupPointer = require('../../wiremock/responses/questionGroups.json')[
  '22222222-2222-2222-2222-222222222203'
].contents[0].contents[0]

const expected = {
  bodyAnswers: {},
  rowDescriptor: 'Kaydan Zhang',
  assessmentId: 'test-assessment-id',
  returnUrl: 'this.url/has',
  submitText: 'Delete item',
  groupId: '22222222-2222-2222-2222-222222222203',
  errors: {},
  errorSummary: null,
}

jest.mock('../../common/data/hmppsAssessmentApi')

const user = { token: 'mytoken', id: '1' }
let expectedForThisTest

describe('display delete table row page', () => {
  const req = {
    body: {},
    originalUrl: 'this.url/has/this/many/parts',
    user,
    params: {
      assessmentId: 'test-assessment-id',
      groupId: '22222222-2222-2222-2222-222222222203',
      tableName: 'children',
      tableRow: 1,
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
  const answers = {
    answers: {
      '946091d2-4038-4e2b-9283-83cc4883cc1': ['Kerrie Manning', 'Kaydan Zhang', 'Kane Webster'],
      '946091d2-4038-4e2b-9283-83cc4883cc2': ['12', '8', '11'],
      '946091d2-4038-4e2b-9283-83cc4883cc3': [
        '22 Constable Drive\nKT3 4RT',
        '100 Drive Street\nFlat 10\nLondon\nW12 8QT',
        '47 Exeter Avenue\nHuntstable\nCB4 2YH',
      ],
      '946091d2-4038-4e2b-9283-83cc4883cc4': [
        '1987-01-12T00:00:00.000Z',
        '2018-09-01T00:00:00.000Z',
        '2016-03-14T00:00:00.000Z',
      ],
      '946091d2-4038-4e2b-9283-83cc4883cc5': [['physical'], ['physical', 'mental'], ['emotional']],
    },
  }

  beforeEach(() => {
    res.locals.questionGroup = JSON.parse(JSON.stringify(questionGroupPointer))
    expectedForThisTest = JSON.parse(JSON.stringify(expected))
    getAnswers.mockReset()
  })

  it('should render the page with the correct structure', async () => {
    getAnswers.mockReturnValueOnce(answers)
    await displayDeleteRow(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expectedForThisTest)
  })

  it('should render the page with the correct structure when table is known', async () => {
    res.locals.questionGroup.contents[3].tableCode = 'children_at_risk_of_serious_harm'
    req.params.tableName = 'children_at_risk_of_serious_harm'
    expectedForThisTest.submitText = 'Delete child'
    getAnswers.mockReturnValueOnce(answers)
    await displayDeleteRow(req, res)
    expect(res.render).toHaveBeenCalledWith(`${__dirname}/index`, expectedForThisTest)
  })

  it('should throw an error when table cannot be found', async () => {
    const thisError = new Error('No table with that name found in question group')
    req.params.tableName = 'nonsense_table_name'
    getAnswers.mockReturnValueOnce(answers)
    await displayDeleteRow(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: thisError })
  })

  it('throws an error when an invalid row of data is requested to be deleted', async () => {
    const thisError = new Error('No table data row found')
    req.params.tableName = 'children'
    getAnswers.mockReturnValueOnce(answers)
    req.params.tableRow = 50
    await displayDeleteRow(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: thisError })
  })
})
