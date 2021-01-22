const { BLANK_ERROR, removeBlankErrors, formatErrors, formatErrorSummary } = require('./formatErrors')

const errors = [
  {
    value: '',
    msg: 'Record how you will take account of diversity factors',
    param: 'diversity',
    location: 'body',
  },
  {
    value: 'My field value',
    msg: { error: 'The error message', errorSummary: 'The error summary message' },
    param: 'needtoknow',
    location: 'body',
  },
  {
    value: 'My other field value',
    msg: { error: 'A single error message' },
    param: 'firstname',
    location: 'body',
  },
]

describe("should remove intentional BLANK_ERROR's from the errors array", () => {
  it("should remove BLANK_ERROR's", () => {
    const rawErrors = [
      {
        value: '',
        msg: BLANK_ERROR,
        param: 'diversity',
        location: 'body',
      },
      ...errors,
      {
        value: 'My field value',
        msg: BLANK_ERROR,
        param: 'needtoknow',
        location: 'body',
      },
    ]
    expect(removeBlankErrors(rawErrors)).toEqual(errors)
  })
})

describe('should format errors into correct form for rendering in templates', () => {
  it('should format errors', () => {
    const expected = {
      diversity: {
        text: 'Record how you will take account of diversity factors',
      },
      needtoknow: {
        text: 'The error message',
      },
      firstname: {
        text: 'A single error message',
      },
    }
    expect(formatErrors(errors)).toEqual(expected)
  })
})

describe('should format errors into correct form for rendering in template error summary', () => {
  it('should format errors', () => {
    const expected = [
      {
        href: '#diversity-error',
        text: 'Record how you will take account of diversity factors',
      },
      {
        href: '#needtoknow-error',
        text: 'The error summary message',
      },
      {
        href: '#firstname-error',
        text: 'A single error message',
      },
    ]
    expect(formatErrorSummary(errors)).toEqual(expected)
  })
})
