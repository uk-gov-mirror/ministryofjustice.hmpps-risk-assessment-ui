const { updateTableRow } = require('./post.controller')
const { updateEditedTableRow } = require('../../common/data/hmppsAssessmentApi')
const questionGroupPointer = require('../../wiremock/responses/questionGroups.json')[
  '22222222-2222-2222-2222-222222222203'
]

jest.mock('../../common/data/hmppsAssessmentApi')

let req
const user = { token: 'mytoken', id: '1' }

beforeEach(() => {
  req = {
    params: {
      assessmentId: 'test-assessment-id',
      groupId: '22222222-2222-2222-2222-222222222204',
      tableName: 'children',
      tableRow: 3,
    },
    originalUrl: 'this.url/has/this/many/parts',
    user,
    body: {},
  }
})

describe('post new table row', () => {
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
    locals: {
      questionGroup: questionGroupPointer.contents[0],
      navigation: { next: { url: 'my/next/page' } },
    },
  }

  it('should call endpoint to save the row', async () => {
    updateEditedTableRow.mockImplementation(() => {
      return [true, {}]
    })

    req.body = {
      'id-11111111-1111-1111-1111-111111111202': 'Hello',
      'id-11111111-1111-1111-1111-111111111201': 'there',
    }
    await updateTableRow(req, res)
    expect(updateEditedTableRow).toHaveBeenCalledWith(
      'test-assessment-id',
      'current',
      'children',
      3,
      {
        answers: {
          '11111111-1111-1111-1111-111111111201': 'there',
          '11111111-1111-1111-1111-111111111202': 'Hello',
        },
      },
      user.token,
      user.id,
    )
    expect(res.redirect).toHaveBeenCalledWith('this.url/has')
  })

  it('should display an error if saving fails', async () => {
    const theError = new Error('Error message')
    updateEditedTableRow.mockImplementation(() => {
      throw theError
    })
    await updateTableRow(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
