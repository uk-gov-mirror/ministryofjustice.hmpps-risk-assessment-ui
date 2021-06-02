const { fetchFilteredReferenceData } = require('./post.controller')
const { getFilteredReferenceData } = require('../../common/data/hmppsAssessmentApi')

jest.mock('../../common/data/hmppsAssessmentApi')

let req
const user = { token: 'mytoken', id: '1' }

beforeEach(() => {
  req = {
    params: {
      assessmentId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      episodeId: 'eeeeeeee-dddd-cccc-bbbb-aaaaaaaaaaaa',
    },
    user,
    body: {},
  }
})

describe('fetch filtered reference data', () => {
  const send = jest.fn()
  const res = {
    json: jest.fn(),
    status: jest.fn(() => ({ send })),
    send,
  }

  it('should fetch filtered reference data from the assessments service', async () => {
    const responseBody = {
      some_field: [
        { code: 'first', description: 'First' },
        { code: 'second', description: 'Second' },
      ],
    }

    getFilteredReferenceData.mockImplementation(() => {
      return [true, responseBody]
    })

    req.body = {
      questionUuid: 'bbbbbbbb-cccc-dddd-eeee-ffffffffffff',
      targetValues: {
        'cccccccc-dddd-eeee-ffff-gggggggggggg': 'some-value',
      },
    }

    await fetchFilteredReferenceData(req, res)

    expect(getFilteredReferenceData).toHaveBeenCalledWith(
      'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      'eeeeeeee-dddd-cccc-bbbb-aaaaaaaaaaaa',
      'bbbbbbbb-cccc-dddd-eeee-ffffffffffff',
      { 'cccccccc-dddd-eeee-ffff-gggggggggggg': 'some-value' },
      user.token,
      user.id,
    )

    expect(res.json).toHaveBeenCalledWith([
      { value: 'first', text: 'First' },
      { value: 'second', text: 'Second' },
    ])
  })

  it('passes response status down to the client when requests fail', async () => {
    /* eslint-disable */
    getFilteredReferenceData.mockImplementation(() =>
      Promise.reject({
        response: {
          status: 418,
        },
      }),
    )
    /* eslint-enable */

    req.body = {
      questionUuid: 'bbbbbbbb-cccc-dddd-eeee-ffffffffffff',
      targetValues: {
        'cccccccc-dddd-eeee-ffff-gggggggggggg': 'some-value',
      },
    }

    await fetchFilteredReferenceData(req, res)

    expect(res.status).toHaveBeenCalledWith(418)
    expect(res.send).toHaveBeenCalled()
  })
})
