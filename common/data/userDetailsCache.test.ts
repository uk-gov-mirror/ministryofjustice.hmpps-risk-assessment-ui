import { jwtDecode } from 'jwt-decode'
import { getCachedUserDetails, cacheUserDetails } from './userDetailsCache'
import { get as _get, set as _set } from './redis'
import userData from '../middleware/testSupportFiles/user_token.json'

jest.mock('../data/redis', () => ({
  get: jest.fn(),
  set: jest.fn(),
}))

describe('Auth', () => {
  beforeEach(() => {
    _get.mockReset()
    _set.mockReset()
  })
  describe('cache user details', () => {
    it('adds the standalone user details to redis cache', async () => {
      const user = jwtDecode(userData.token)

      await cacheUserDetails(user)
      // Persist user details to Redis and key by the user's ID
      expect(_set).toHaveBeenCalledWith('user:1', '{"username":"ITAG_USER"}', 'EX', 43200)
    })

    it('get the user details from redis cache', async () => {
      _get.mockResolvedValue('{"username":"RAY_ARNOLD", "name":"Ray Arnold"}')

      const cachedDetails = await getCachedUserDetails(1)

      expect(_get).toHaveBeenCalledWith('user:1')
      const userDetails = {
        name: 'Ray Arnold',
        username: 'RAY_ARNOLD',
      }
      expect(cachedDetails).toStrictEqual(userDetails)
    })
  })
})
