const { customValidationsCaringCommitments } = require('./fields')
const { noSpace } = require('../../common/middleware/form-wizard-validators/validators')

describe('customValidationsCaringCommitments', () => {
  let fields
  beforeEach(() => {
    fields = {
      caring_commitments: {
        validate: [],
      },
      caring_commitments_details: {
        validate: [],
      },
    }
  })
  it('Adds the validator if there is no new caring commitments data', () => {
    const updatedFields = customValidationsCaringCommitments(fields, null)
    expect(updatedFields).toEqual({
      caring_commitments: {
        validate: [
          {
            message: 'Select yes or no',
            type: 'required',
          },
        ],
      },
      caring_commitments_details: {
        validate: [
          {
            fn: noSpace,
            message: 'Enter details',
          },
          {
            message: 'Enter details',
            type: 'required',
          },
        ],
      },
    })
  })
  it('Does not add the validators if there is new caring commitments data', () => {
    const updatedFields = customValidationsCaringCommitments(fields, [])
    expect(updatedFields).toEqual({
      caring_commitments: {
        validate: [],
      },
      caring_commitments_details: {
        validate: [],
      },
    })
  })
})
