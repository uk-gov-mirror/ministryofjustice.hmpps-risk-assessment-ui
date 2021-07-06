const {
  questionGroupValidationRules,
  extractAnswers,
  formatValidationErrors,
  assembleDates,
} = require('./post-question-groups')
const { dynamicMiddleware } = require('../utils/util')
const { logger } = require('../logging/logger')

jest.mock('../utils/util', () => ({
  dynamicMiddleware: jest.fn(),
}))

jest.mock('../logging/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}))

const questionGroupWithConditional = {
  type: 'group',
  groupId: 'dc9baeea-566f-435f-8557-c3ab139befea',
  groupCode: 'test_question_group',
  title: 'Test question group',
  contents: [
    {
      type: 'question',
      questionId: 'b9065f11-0955-416d-bd58-c234d8b6ffb5',
      questionCode: '123',
      answerType: 'radio',
      questionText: 'Dependency subject',
      displayOrder: 1,
      mandatory: true,
      validation: '{"mandatory":{"errorMessage":"Select yes or no","errorSummary":"Select yes or no"}}',
      readOnly: false,
      conditional: false,
      referenceDataTargets: [],
      answerSchemas: [
        {
          answerSchemaUuid: '0a4dacc1-e37e-4256-9e48-34a601467a0c',
          answerSchemaCode: 'yes',
          value: 'YES',
          text: 'Yes',
          conditionals: [
            {
              conditional: '4d3e9793-e24f-4ccc-94c8-39b2f507e649',
              displayInline: true,
            },
          ],
        },
        {
          answerSchemaUuid: 'fe00388b-003c-4110-a03e-ad9c1d2d11b9',
          answerSchemaCode: 'no',
          value: 'NO',
          text: 'No',
        },
        {
          answerSchemaUuid: '665ec981-36ea-4911-989d-06bfc0fd7f96',
          answerSchemaCode: 'don_t_know',
          value: 'DK',
          text: "Don't Know",
        },
      ],
    },
    {
      type: 'question',
      questionId: '4d3e9793-e24f-4ccc-94c8-39b2f507e649',
      questionCode: '124',
      answerType: 'freetext',
      questionText: 'Dependency target',
      displayOrder: 2,
      mandatory: true,
      validation: '{"mandatory":{"errorMessage":"Enter text","errorSummary":"Enter text"}}',
      readOnly: false,
      conditional: true,
      referenceDataTargets: [],
      answerSchemas: [],
    },
  ],
}

const questionGroupWithOrphanConditional = {
  type: 'group',
  groupId: 'dc9baeea-566f-435f-8557-c3ab139befea',
  groupCode: 'test_question_group',
  title: 'Test question group',
  contents: [
    {
      type: 'question',
      questionId: '4d3e9793-e24f-4ccc-94c8-39b2f507e649',
      questionCode: '124',
      answerType: 'freetext',
      questionText: 'Dependency target',
      displayOrder: 2,
      mandatory: true,
      validation: '{"mandatory":{"errorMessage":"Enter text","errorSummary":"Enter text"}}',
      readOnly: false,
      conditional: true,
      referenceDataTargets: [],
      answerSchemas: [],
    },
  ],
}

const questionGroupWithNoConditional = {
  type: 'group',
  groupId: 'dc9baeea-566f-435f-8557-c3ab139befea',
  groupCode: 'test_question_group',
  title: 'Test question group',
  contents: [
    {
      type: 'question',
      questionId: '4d3e9793-e24f-4ccc-94c8-39b2f507e649',
      questionCode: '124',
      answerType: 'freetext',
      questionText: 'Dependency target',
      displayOrder: 2,
      mandatory: true,
      validation: '{"mandatory":{"errorMessage":"Enter text","errorSummary":"Enter text"}}',
      readOnly: false,
      conditional: false,
      referenceDataTargets: [],
      answerSchemas: [],
    },
  ],
}

describe('Question group validation rules', () => {
  const next = jest.fn()

  beforeEach(() => {
    dynamicMiddleware.mockReset()
    next.mockReset()
    logger.info.mockReset()
    logger.error.mockReset()
  })

  it('adds validation when a triggering answer is present', async () => {
    const res = {
      locals: {
        questionGroup: questionGroupWithConditional,
      },
    }

    const req = {
      params: {},
      body: {
        'id-b9065f11-0955-416d-bd58-c234d8b6ffb5': 'YES',
      },
    }

    await questionGroupValidationRules(req, res, next)

    const [validatorsToSend] = dynamicMiddleware.mock.calls[0]

    expect(validatorsToSend).toBeDefined()
    expect(validatorsToSend.length).toBe(2)

    // Each validator is a piece of middleware
    validatorsToSend.forEach(validator => expect(typeof validator).toBe('function'))
  })

  it('does not add validation when a triggering answer is not present', async () => {
    const res = {
      locals: {
        questionGroup: questionGroupWithConditional,
      },
    }

    const req = {
      params: {},
      body: {
        'id-b9065f11-0955-416d-bd58-c234d8b6ffb5': 'NO',
      },
    }

    await questionGroupValidationRules(req, res, next)

    const [validatorsToSend] = dynamicMiddleware.mock.calls[0]

    expect(validatorsToSend).toBeDefined()
    expect(validatorsToSend.length).toBe(1)

    // Each validator is a piece of middleware
    validatorsToSend.forEach(validator => expect(typeof validator).toBe('function'))
  })

  it('gracefully handles when no parent question is found', async () => {
    const res = {
      locals: {
        questionGroup: questionGroupWithOrphanConditional,
      },
    }

    const req = {
      params: {},
      body: {
        'id-b9065f11-0955-416d-bd58-c234d8b6ffb5': 'NO',
      },
    }

    await questionGroupValidationRules(req, res, next)

    const [validatorsToSend] = dynamicMiddleware.mock.calls[0]

    expect(validatorsToSend).toBeDefined()
    expect(validatorsToSend.length).toBe(0)

    // Ensure we log this event
    expect(logger.error).toHaveBeenCalled()
  })

  it('returns the validators when not conditional', async () => {
    const res = {
      locals: {
        questionGroup: questionGroupWithNoConditional,
      },
    }

    const req = {
      params: {},
      body: {
        'id-b9065f11-0955-416d-bd58-c234d8b6ffb5': 'NO',
      },
    }

    await questionGroupValidationRules(req, res, next)

    const [validatorsToSend] = dynamicMiddleware.mock.calls[0]

    expect(validatorsToSend).toBeDefined()
    expect(validatorsToSend.length).toBe(1)
  })
})

describe('Assemble dates', () => {
  const next = jest.fn()

  beforeEach(() => {
    next.mockReset()
  })

  it('returns a Date object for date fields', () => {
    const res = {}
    const req = {
      body: {
        '0ee3f843-d04f-4f0c-bc32-b421f5864c00-day': 19,
        '0ee3f843-d04f-4f0c-bc32-b421f5864c00-month': 1,
        '0ee3f843-d04f-4f0c-bc32-b421f5864c00-year': 1989,
      },
    }

    assembleDates(req, res, next)

    expect(req.body['0ee3f843-d04f-4f0c-bc32-b421f5864c00']).toEqual(new Date('1989-01-19').toISOString())
    // deletes the component fields
    expect(req.body['0ee3f843-d04f-4f0c-bc32-b421f5864c00-day']).toBeUndefined()
    expect(req.body['0ee3f843-d04f-4f0c-bc32-b421f5864c00-month']).toBeUndefined()
    expect(req.body['0ee3f843-d04f-4f0c-bc32-b421f5864c00-year']).toBeUndefined()
  })

  it('does not assemble the date if the day is missing', () => {
    const res = {}
    const req = {
      body: {
        '0ee3f843-d04f-4f0c-bc32-b421f5864c00-month': 1,
        '0ee3f843-d04f-4f0c-bc32-b421f5864c00-year': 1989,
      },
    }

    assembleDates(req, res, next)

    expect(req.body['0ee3f843-d04f-4f0c-bc32-b421f5864c00']).toBeUndefined()
  })

  it('does not assemble the date if the month is missing', () => {
    const res = {}
    const req = {
      body: {
        '0ee3f843-d04f-4f0c-bc32-b421f5864c00-day': 19,
        '0ee3f843-d04f-4f0c-bc32-b421f5864c00-year': 1989,
      },
    }

    assembleDates(req, res, next)

    expect(req.body['0ee3f843-d04f-4f0c-bc32-b421f5864c00']).toEqual('')
  })

  it('does not assemble the date if the year is missing', () => {
    const res = {}
    const req = {
      body: {
        '0ee3f843-d04f-4f0c-bc32-b421f5864c00-day': 19,
        '0ee3f843-d04f-4f0c-bc32-b421f5864c00-month': 1,
      },
    }

    assembleDates(req, res, next)

    expect(req.body['0ee3f843-d04f-4f0c-bc32-b421f5864c00']).toEqual('')
  })
})

describe('Format validation errors', () => {
  it('formats server errors when passed', () => {
    const serverErrors = {
      '4d3e9793-e24f-4ccc-94c8-39b2f507e649': ['Must not be null'],
    }
    const pageErrors = []

    const [errors, errorSummary] = formatValidationErrors(serverErrors, pageErrors)

    expect(errors).toEqual({
      'id-4d3e9793-e24f-4ccc-94c8-39b2f507e649': { text: 'Must not be null' },
    })
    expect(errorSummary).toEqual([{ text: 'Must not be null', href: '#id-4d3e9793-e24f-4ccc-94c8-39b2f507e649-error' }])
  })

  it('formats page errors when passed', () => {
    const serverErrors = {}
    const pageErrors = ['Something went wrong']

    const [errors, errorSummary] = formatValidationErrors(serverErrors, pageErrors)

    expect(errors).toEqual({})
    expect(errorSummary).toEqual([{ text: 'Something went wrong', href: '#' }])
  })

  it('handles no errors', () => {
    const serverErrors = {}
    const pageErrors = {}

    const [errors, errorSummary] = formatValidationErrors(serverErrors, pageErrors)

    expect(errors).toBeDefined()
    expect(errorSummary).toBeDefined()
  })
})

describe('Extract answers', () => {
  it('formats answers that are passed to it', () => {
    const postBody = {
      'id-b9065f11-0955-416d-bd58-c234d8b6ffb5': 'YES',
    }

    const { answers } = extractAnswers(postBody)

    expect(answers['b9065f11-0955-416d-bd58-c234d8b6ffb5']).toEqual('YES')
  })

  it('handles when no answers are passed', () => {
    const postBody = {}

    const { answers } = extractAnswers(postBody)

    expect(answers).toBeDefined()
  })
})
