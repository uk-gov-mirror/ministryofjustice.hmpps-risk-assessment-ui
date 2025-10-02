import { jest } from '@jest/globals'
import { getNamespace } from 'cls-hooked'
import { updateCorrelationId } from './updateCorrelationId'
import { updateMDC } from '../utils/util'

jest.mock('../utils/util.js', () => ({
  updateMDC: jest.fn(),
}))

jest.mock('cls-hooked')

describe('Set correlation ID to value of x-request-id if it is present', () => {
  let req
  let res
  beforeEach(() => {
    req = {
      headers: {
        'x-auth-token': 'THX1138',
      },
    }
    getNamespace.mockImplementation(() => ({
      get: jest.fn(() => {
        return { correlationId: 'existingId' }
      }),
      set: jest.fn(),
    }))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('should not change correlation ID', (done) => {
    updateCorrelationId(req, res, done)
    expect(getNamespace).not.toHaveBeenCalled()
  })

  test('should update correlation ID', (done) => {
    req.headers['x-request-id'] = 'NCC-1701'
    updateCorrelationId(req, res, done)
    expect(getNamespace).toHaveBeenCalled()
    expect(updateMDC).toHaveBeenCalledWith('MDC', { correlationId: 'NCC-1701' })
  })
})
