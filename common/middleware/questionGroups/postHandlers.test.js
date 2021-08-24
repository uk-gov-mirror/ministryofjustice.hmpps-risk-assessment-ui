const {
  questionGroupValidationRules,
  extractAnswers,
  formatValidationErrors,
  assembleDates,
} = require('./postHandlers')
const { dynamicMiddleware } = require('../../utils/util')
const { logger } = require('../../logging/logger')

jest.mock('../../utils/util', () => ({
  dynamicMiddleware: jest.fn(),
}))

jest.mock('../../logging/logger', () => ({
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
      questionCode: 'dependency_subject',
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
              conditional: 'dependency_target',
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
      questionCode: 'dependency_target',
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
      questionCode: 'dependency_target',
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
      questionCode: 'dependency_target',
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
        dependency_subject: 'YES',
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
        some_random_question: 'NO',
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
        question_with_no_parent: 'NO',
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
        non_conditional_question: 'NO',
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
        'some_date_field-day': 19,
        'some_date_field-month': 1,
        'some_date_field-year': 1989,
      },
    }

    assembleDates(req, res, next)

    expect(req.body.some_date_field).toEqual('1989-01-19')
    // deletes the component fields
    expect(req.body['some_date_field-day']).toBeUndefined()
    expect(req.body['some_date_field-month']).toBeUndefined()
    expect(req.body['some_date_field-year']).toBeUndefined()
  })

  it('does not assemble the date if the day is missing', () => {
    const res = {}
    const req = {
      body: {
        'some_date_field-month': 1,
        'some_date_field-year': 1989,
      },
    }

    assembleDates(req, res, next)

    expect(req.body.some_date_field).toBeUndefined()
  })

  it('does not assemble the date if the month is missing', () => {
    const res = {}
    const req = {
      body: {
        'some_date_field-day': 19,
        'some_date_field-year': 1989,
      },
    }

    assembleDates(req, res, next)

    expect(req.body.some_date_field).toEqual('')
  })

  it('does not assemble the date if the year is missing', () => {
    const res = {}
    const req = {
      body: {
        'some_date_field-day': 19,
        'some_date_field-month': 1,
      },
    }

    assembleDates(req, res, next)

    expect(req.body.some_date_field).toEqual('')
  })
})

describe('Format validation errors', () => {
  it('formats server errors when passed', () => {
    const serverErrors = {
      some_field: ['Must not be null'],
    }
    const pageErrors = []

    const [errors, errorSummary] = formatValidationErrors(serverErrors, pageErrors)

    expect(errors).toEqual({
      some_field: { text: 'Must not be null' },
    })
    expect(errorSummary).toEqual([{ text: 'Must not be null', href: '#some_field-error' }])
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
    const req = {
      body: {
        some_question_code: 'YES',
      },
    }

    const res = {
      locals: {
        questionGroup: {
          contents: [],
        },
      },
    }

    const next = jest.fn()

    extractAnswers(req, res, next)

    expect(req.body.some_question_code).toEqual('YES')
  })

  it('handles when no answers are passed', () => {
    const req = {
      body: {
        some_random_question: 'YES',
      },
    }

    const res = {
      locals: {
        questionGroup: {
          contents: [],
        },
      },
    }

    const next = jest.fn()

    extractAnswers(req, res, next)

    expect(req.body).toBeDefined()
  })
})
