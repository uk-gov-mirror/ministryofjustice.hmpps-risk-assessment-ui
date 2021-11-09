const { checkUserHasAreaSelected, checkAssessmentType } = require('./area-selection')
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
  const session = {}
  const res = { redirect: jest.fn(), render: jest.fn() }
  const next = jest.fn()

  beforeEach(() => {
    next.mockReset()
    defaultSession.save.mockReset()
    res.redirect.mockReset()
    res.render.mockReset()
    delete session.standaloneAssessment
  })

  it('does nothing when a region is already selected', async () => {
    session.standaloneAssessment = false
    const middleware = checkUserHasAreaSelected()

    await middleware({ session, defaultSession, user: { areaCode: 'ABC' } }, res, next)

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

describe('checkAssessmentType', () => {
  const session = { save: jest.fn() }
  const next = jest.fn()
  const res = {}
  const req = { session, query: {} }

  beforeEach(() => {
    next.mockReset()
    session.save.mockReset()
    delete req.session.standaloneAssessment
    delete req.query.assessmentType
    delete req.originalUrl
  })

  it('sets standalone flag when assessment type is in query parameters', async () => {
    req.query.assessmentType = 'UPW'
    const middleware = checkAssessmentType()

    await middleware(req, res, next)

    expect(req.session.standaloneAssessment).toBe(true)
    expect(next).toHaveBeenCalled()
  })

  it('sets standalone flag to false when query parameters assessment does not exist', async () => {
    req.query.assessmentType = 'NOT_ASSESSMENT'
    const middleware = checkAssessmentType()

    await middleware(req, res, next)

    expect(req.session.standaloneAssessment).toBe(false)
    expect(next).toHaveBeenCalled()
  })

  it('sets standalone flag when assessment URL contains assessment code', async () => {
    req.originalUrl = '/RSR/assessment_page'
    const middleware = checkAssessmentType()

    await middleware(req, res, next)

    expect(req.session.standaloneAssessment).toBe(true)
    expect(next).toHaveBeenCalled()
  })

  it('sets standalone flag to false when assessment URL does not contain assessment code', async () => {
    req.originalUrl = '/NOT_ASSESSMENT/assessment_page'
    const middleware = checkAssessmentType()

    await middleware(req, res, next)

    expect(req.session.standaloneAssessment).toBe(false)
    expect(next).toHaveBeenCalled()
  })
})
