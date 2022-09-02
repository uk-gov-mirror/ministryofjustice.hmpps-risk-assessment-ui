const { checkAssessmentType } = require('./area-selection')

jest.mock('../data/offenderAssessmentApi', () => ({
  getUserProfile: jest.fn(),
}))

jest.mock('../data/userDetailsCache', () => ({
  cacheUserDetailsWithRegion: jest.fn(),
}))

jest.mock('../data/oauth', () => ({
  getApiToken: jest.fn(),
}))

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
