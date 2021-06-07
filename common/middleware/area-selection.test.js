const { checkUserHasAreaSelected } = require('./area-selection')
const { getUserProfile } = require('../data/offenderAssessmentApi')
const { cacheUserDetailsWithRegion } = require('../data/userDetailsCache')
const { getApiToken } = require('../data/oauth')

jest.mock('../data/offenderAssessmentApi', () => ({
  getUserProfile: jest.fn(),
}))

jest.mock('../data/userDetailsCache', () => ({
  cacheUserDetailsWithRegion: jest.fn(),
}))

jest.mock('../data/oauth', () => ({
  getApiToken: jest.fn(),
}))

describe('checkUserHasAreaSelected', () => {
  const defaultSession = { save: jest.fn() }
  const res = { redirect: jest.fn(), render: jest.fn() }
  const next = jest.fn()

  beforeEach(() => {
    next.mockReset()
    defaultSession.save.mockReset()
    res.redirect.mockReset()
    res.render.mockReset()
  })

  it('does nothing when a region is already selected', async () => {
    const middleware = checkUserHasAreaSelected()

    await middleware({ defaultSession, user: { areaCode: 'ABC' } }, res, next)

    expect(next).toHaveBeenCalled()
  })

  it('defaults when only a single region is available', async () => {
    const req = { session: { ...defaultSession }, user: {} }
    const regions = [{ code: 'ABC', name: 'Abc' }]
    const middleware = checkUserHasAreaSelected()

    getApiToken.mockResolvedValue('FOO_TOKEN')
    getUserProfile.mockResolvedValue({ regions })

    await middleware(req, res, next)

    expect(cacheUserDetailsWithRegion).toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })

  it('redirects to the area selection page when user has no area', async () => {
    const originalUrl = '/foo/bar'
    const req = { session: { ...defaultSession }, user: {}, originalUrl }
    const regions = [
      { code: 'ABC', name: 'Abc' },
      { code: 'DEF', name: 'Def' },
    ]

    const middleware = checkUserHasAreaSelected()

    getApiToken.mockResolvedValue('FOO_TOKEN')
    getUserProfile.mockResolvedValue({ regions })

    await middleware(req, res, next)

    expect(req.session.save).toHaveBeenCalled()
    expect(req.session.regions).toEqual(regions)
    expect(req.session.redirectUrl).toEqual(originalUrl)
    expect(res.redirect).toHaveBeenCalled()
  })

  it('allows an override for the redirect URL', async () => {
    const redirectUrl = '/foo/bar'
    const req = { session: { ...defaultSession }, user: {} }
    const regions = [
      { code: 'ABC', name: 'Abc' },
      { code: 'DEF', name: 'Def' },
    ]

    const middleware = checkUserHasAreaSelected(redirectUrl)

    getApiToken.mockResolvedValue('FOO_TOKEN')
    getUserProfile.mockResolvedValue({ regions })

    await middleware(req, res, next)

    expect(req.session.save).toHaveBeenCalled()
    expect(req.session.regions).toEqual(regions)
    expect(req.session.redirectUrl).toEqual(redirectUrl)
    expect(res.redirect).toHaveBeenCalled()
  })

  it('should render the error page', async () => {
    const error = new Error('Error message')
    const req = { session: { ...defaultSession }, user: {} }

    const middleware = checkUserHasAreaSelected()

    getApiToken.mockResolvedValue('FOO_TOKEN')
    getUserProfile.mockRejectedValue(error)

    await middleware(req, res, next)

    expect(res.render).toHaveBeenCalledWith(`app/error`, { error })
  })
})
