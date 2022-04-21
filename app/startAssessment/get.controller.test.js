const { getCurrentEpisodeForCrn, getOffenderAndOffenceDetails } = require('../../common/data/hmppsAssessmentApi')
const { verifyAssessment } = require('./get.controller')
const offenderAndOffenceDetails = require('../../wiremock/responses/offenderAndOffenceDetails.json')
const currentEpisodeDetails = require('../../wiremock/responses/currentEpisodeByCrn.json')

jest.mock('../../common/data/hmppsAssessmentApi', () => ({
  getCurrentEpisodeForCrn: jest.fn(),
  getOffenderAndOffenceDetails: jest.fn(),
}))

describe('verifyAssessment', () => {
  const baseReq = {
    user: {
      id: 1,
      token: 'USER_TOKEN',
    },
    session: {},
  }
  const baseSession = {
    save: jest.fn(),
  }
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }
  const next = jest.fn()

  beforeEach(() => {
    getCurrentEpisodeForCrn.mockReset()
    getOffenderAndOffenceDetails.mockReset()
    res.redirect.mockReset()
    res.render.mockReset()
    next.mockReset()
    baseSession.save.mockReset()

    baseReq.session = { ...baseSession }
  })

  it('gets offender and offence details then redirects', async () => {
    getCurrentEpisodeForCrn.mockResolvedValue(currentEpisodeDetails)
    getOffenderAndOffenceDetails.mockResolvedValue(offenderAndOffenceDetails)

    const req = {
      ...baseReq,
      query: {
        crn: '123456',
        eventId: 1,
        assessmentType: 'UPW',
      },
    }

    await verifyAssessment(req, res, next)

    expect(getCurrentEpisodeForCrn).toHaveBeenCalledWith('123456', 'USER_TOKEN', 1)
    expect(getOffenderAndOffenceDetails).toHaveBeenCalledWith('123456', 1, 'UPW', null, 'USER_TOKEN', 1)

    expect(res.redirect).toHaveBeenCalledWith(`/${req.query.assessmentType}/start`)
  })

  it('stores offender, offence and last edited details in the session', async () => {
    getCurrentEpisodeForCrn.mockResolvedValue(currentEpisodeDetails)
    getOffenderAndOffenceDetails.mockResolvedValue(offenderAndOffenceDetails)

    const req = {
      ...baseReq,
      query: {
        crn: '123456',
        eventId: 1,
        assessmentType: 'UPW',
      },
    }

    jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-01').getTime())

    await verifyAssessment(req, res, next)

    expect(req.session).toEqual({
      ...baseSession,
      assessment: {
        assessmentCode: 'UPW',
        deliusEventType: null,
        eventId: 1,
        lastEditedBy: 'A Alonso',
        lastEditedDate: '2022-04-01T09:00',
        offence: {
          offence: '046',
          offenceDescription: 'Stealing from shops and stalls (shoplifting)',
          sentenceDate: '25th August 2020',
          subCode: '00',
          subCodeDescription: 'Stealing from shops and stalls (shoplifting)',
        },
        subject: {
          age: 40,
          crn: 'DX5678A',
          dob: '1979-08-18',
          name: 'John Smith',
          pnc: 'A/1234560BA',
          subjectUuid: 101,
        },
      },
    })

    jest.useRealTimers()
  })

  it('stores details in the session when there is no previous episode', async () => {
    getCurrentEpisodeForCrn.mockResolvedValue({})
    getOffenderAndOffenceDetails.mockResolvedValue(offenderAndOffenceDetails)

    const req = {
      ...baseReq,
      query: {
        crn: '123456',
        eventId: 1,
        assessmentType: 'UPW',
      },
    }

    jest.useFakeTimers('modern').setSystemTime(new Date('2020-01-01').getTime())

    await verifyAssessment(req, res, next)

    expect(req.session.lastEditedBy).toEqual(undefined)
    expect(req.session.lastEditedDate).toEqual(undefined)

    jest.useRealTimers()
  })

  it('returns an error when passed no CRN', async () => {
    const req = {
      ...baseReq,
      query: {
        eventId: 1,
        assessmentType: 'RSR',
      },
    }

    await verifyAssessment(req, res, next)

    expect(next).toHaveBeenCalledWith(new Error('CRN is mandatory'))
  })

  it('returns an error when passed no assessment type', async () => {
    const req = {
      ...baseReq,
      query: {
        crn: '123456',
        eventId: 1,
      },
    }

    await verifyAssessment(req, res, next)

    expect(next).toHaveBeenCalledWith(new Error('Assessment type is mandatory'))
  })
})
