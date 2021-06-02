const { cacheUserDetails, getCachedUserDetails } = require('./userDetailsCache')
const redis = require('./redis')

jest.mock('../data/redis', () => ({
  get: jest.fn(),
  set: jest.fn(),
}))

describe('Auth', () => {
  beforeEach(() => {
    redis.get.mockReset()
    redis.set.mockReset()
  })
  describe('cache user details', () => {
    it('adds the user details to redis cache', async () => {
      const oasysUser = {
        oasysUserCode: 'USER_CODE',
        userForename1: 'Test',
        userFamilyName: 'User',
        email: 'foo@bar.baz',
        accountStatus: 'ACTIVE',
      }

      await cacheUserDetails(1, oasysUser)
      // Persist user details to Redis and key by the user's ID
      expect(redis.set).toHaveBeenCalledWith(
        'user:1',
        '{"isActive":true,"email":"foo@bar.baz","oasysUserCode":"USER_CODE","username":"Test User"}',
        'EX',
        43200,
      )
    })

    it('get the user details from redis cache', async () => {
      redis.get.mockResolvedValue(
        '{"isActive":true,"email":"foo@bar.baz","oasysUserCode":"SUPPORT1","username":"Ray Arnold","areaCode":"HFS","areaName":"Hertfordshire"}',
      )

      const cachedDetails = await getCachedUserDetails(1)

      expect(redis.get).toHaveBeenCalledWith('user:1')
      const userDetails = {
        isActive: true,
        oasysUserCode: 'SUPPORT1',
        username: 'Ray Arnold',
        email: 'foo@bar.baz',
        areaCode: 'HFS',
        areaName: 'Hertfordshire',
      }
      expect(cachedDetails).toStrictEqual(userDetails)
    })
  })
})
