const { removeTableRow } = require('./post.controller')
const { deleteTableRow } = require('../../common/data/hmppsAssessmentApi')

jest.mock('../../common/data/hmppsAssessmentApi')
const user = { token: 'mytoken', id: '1' }
const reqSetup = {
  params: {
    assessmentId: 'test-assessment-id',
    tableName: 'children',
    tableRow: 3,
  },
  originalUrl: 'this.url/has/this/many/parts',
  user,
  body: {},
}

describe('delete table row', () => {
  let req
  beforeEach(() => {
    req = JSON.parse(JSON.stringify(reqSetup))
    deleteTableRow.mockReset()
  })
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
    locals: {
      navigation: { next: { url: 'my/next/page' } },
    },
  }

  it('should call endpoint to delete the row', async () => {
    deleteTableRow.mockImplementation(() => {
      return [true, {}]
    })

    req.body = { 'confirm-delete': 'yes' }

    await removeTableRow(req, res)
    expect(deleteTableRow).toHaveBeenCalledWith('test-assessment-id', 'current', 'children', 3, user.token, user.id)
    expect(deleteTableRow).toHaveBeenCalledTimes(1)
    expect(res.redirect).toHaveBeenCalledWith('this.url/has')
  })

  it('should not call endpoint to delete the row when user has not confirmed', async () => {
    req.body = { 'confirm-delete': 'no' }
    await removeTableRow(req, res)
    expect(deleteTableRow).not.toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith('this.url/has')
  })

  it('should display an error if deleting fails', async () => {
    req.body = { 'confirm-delete': 'yes' }
    const theError = new Error('Error message')
    deleteTableRow.mockImplementation(() => {
      throw theError
    })
    await removeTableRow(req, res)
    expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
  })
})
