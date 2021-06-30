const { redirectToAssessmentList } = require('./post.controller')
const { cacheUserDetailsWithRegion } = require('../../common/data/userDetailsCache')

jest.mock('../../common/data/userDetailsCache', () => ({
  cacheUserDetailsWithRegion: jest.fn(),
}))

describe('select area', () => {
  const res = {
    render: jest.fn(),
    redirect: jest.fn(),
  }

  beforeEach(() => {
    cacheUserDetailsWithRegion.mockReset()
    res.render.mockReset()
    res.redirect.mockReset()
  })

  it('redirects when a valid area is selected', async () => {
    const req = {
      session: {
        save: jest.fn(),
        regions: [
          { name: 'foo', code: 'FOO' },
          { name: 'bar', code: 'BAR' },
        ],
        redirectUrl: '/foo/bar',
      },
      user: {
        id: 1,
      },
      body: {
        area: '{ "areaName": "foo", "areaCode": "FOO" }',
      },
    }

    await redirectToAssessmentList(req, res)

    expect(cacheUserDetailsWithRegion).toHaveBeenCalledWith(req.user.id, 'FOO', 'foo')
    expect(res.redirect).toHaveBeenCalledWith('/foo/bar')
  })

  it('renders with a validation message when an invalid area is selected', async () => {
    const req = {
      session: {
        save: jest.fn(),
        regions: [
          { name: 'foo', code: 'FOO' },
          { name: 'bar', code: 'BAR' },
        ],
      },
      user: {
        id: 1,
      },
      body: {
        area: '{ "areaName": "baz", "areaCode": "BAZ" }',
      },
    }

    await redirectToAssessmentList(req, res)

    expect(cacheUserDetailsWithRegion).not.toHaveBeenCalled()
    expect(res.render).toHaveBeenCalled()

    const lastCall = res.render.mock.calls[0]
    const [template, templateParams] = lastCall

    expect(template).toEqual(`${__dirname}/index`)
    expect(templateParams?.areas?.error).toBeDefined()
    expect(templateParams?.areas?.options).toEqual([
      {
        text: 'foo',
        value: '{"areaName":"foo","areaCode":"FOO"}',
      },
      {
        text: 'bar',
        value: '{"areaName":"bar","areaCode":"BAR"}',
      },
    ])
  })

  it('renders an error page if unable to store the area in session', async () => {
    const req = {
      session: {
        save: jest.fn(),
        regions: [
          { name: 'foo', code: 'FOO' },
          { name: 'bar', code: 'BAR' },
        ],
        redirectUrl: '/foo/bar',
      },
      user: {
        id: 1,
      },
      body: {
        area: '{ "areaName": "foo", "areaCode": "FOO" }',
      },
    }

    const theError = new Error('💥')

    cacheUserDetailsWithRegion.mockRejectedValue(theError)

    await redirectToAssessmentList(req, res)

    expect(cacheUserDetailsWithRegion).toHaveBeenCalled()
    expect(res.render).toHaveBeenCalledWith('app/error', { error: theError })
  })
})
