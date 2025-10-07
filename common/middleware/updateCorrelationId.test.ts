import { getNamespace } from 'cls-hooked'
import { updateCorrelationId } from './updateCorrelationId'
import { updateMDC } from '../utils/util'

jest.mock('../utils/util')
jest.mock('cls-hooked')

const mockedGetNamespace = jest.mocked(getNamespace)
const mockedUpdateMDC = jest.mocked(updateMDC)

describe('Set correlation ID to value of x-request-id if it is present', () => {
  let req
  let res

  beforeEach(() => {
    req = { headers: { 'x-auth-token': 'THX1138' } }
    mockedGetNamespace.mockImplementation(() => ({
      get: jest.fn(() => ({ correlationId: 'existingId' })),
      set: jest.fn(),
    }))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('should not change correlation ID', (done) => {
    updateCorrelationId(req, res, done)
    expect(mockedGetNamespace).not.toHaveBeenCalled()
  })

  test('should update correlation ID', (done) => {
    req.headers['x-request-id'] = 'NCC-1701'
    updateCorrelationId(req, res, done)

    expect(mockedGetNamespace).toHaveBeenCalled()
    expect(mockedUpdateMDC).toHaveBeenCalledWith('MDC', { correlationId: 'NCC-1701' })
  })
})
