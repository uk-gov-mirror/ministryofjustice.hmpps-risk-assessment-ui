const { extractAnswers, formatValidationErrors, assembleDates } = require('./postHandlers')

jest.mock('../../logging/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}))

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

    expect(req.body.some_date_field).toEqual(null)
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
