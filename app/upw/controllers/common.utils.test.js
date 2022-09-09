const { getRegistrationsForCrn, getRoshRiskSummaryForCrn } = require('../../../common/data/hmppsAssessmentApi')
const { getRegistrations, getRoshRiskSummary, hasModernSlaveryFlags } = require('./common.utils')

jest.mock('../../../common/data/hmppsAssessmentApi')

const user = { id: 1, token: 'FOO_TOKEN' }

describe('GetRegistrations', () => {
  it('returns MAPPA data', async () => {
    getRegistrationsForCrn.mockResolvedValue({
      status: 200,
      response: {
        mappa: {
          level: 'M1',
          levelDescription: 'MAPPA Level 1',
          category: 'M2',
          categoryDescription: 'MAPPA Cat 2',
          startDate: '2021-10-10',
        },
        flags: [],
      },
    })

    const registrations = await getRegistrations('A123456', user)

    expect(registrations).toEqual({
      flags: [],
      mappa: {
        lastUpdated: '10th October 2021',
        isNominal: false,
        level: 'CAT 2/LEVEL 1',
      },
    })
  })

  it('handles when there is no MAPPA data', async () => {
    getRegistrationsForCrn.mockResolvedValue({
      status: 200,
      response: {
        flags: [],
      },
    })

    const registrations = await getRegistrations('A123456', user)

    expect(registrations).toEqual({
      flags: [],
      mappa: {
        level: null,
        isNominal: null,
        lastUpdated: null,
      },
    })
  })

  it('handles when there is no MAPPA category', async () => {
    getRegistrationsForCrn.mockResolvedValue({
      status: 200,
      response: {
        mappa: {
          level: 'M1',
          levelDescription: 'MAPPA Level 1',
          startDate: '2021-10-10',
        },
        flags: [],
      },
    })

    const registrations = await getRegistrations('A123456', user)

    expect(registrations).toEqual({
      flags: [],
      mappa: {
        level: 'LEVEL 1',
        isNominal: false,
        lastUpdated: '10th October 2021',
      },
    })
  })

  it('handles when there is no MAPPA level', async () => {
    getRegistrationsForCrn.mockResolvedValue({
      status: 200,
      response: {
        mappa: {
          category: 'M2',
          categoryDescription: 'MAPPA Cat 2',
          startDate: '2021-10-10',
        },
        flags: [],
      },
    })

    const registrations = await getRegistrations('A123456', user)

    expect(registrations).toEqual({
      flags: [],
      mappa: {
        level: 'CAT 2',
        isNominal: null,
        lastUpdated: '10th October 2021',
      },
    })
  })

  it('handles when there is no MAPPA startDate', async () => {
    getRegistrationsForCrn.mockResolvedValue({
      status: 200,
      response: {
        mappa: {
          level: 'M1',
          levelDescription: 'MAPPA Level 1',
          category: 'M2',
          categoryDescription: 'MAPPA Cat 2',
        },
        flags: [],
      },
    })

    const registrations = await getRegistrations('A123456', user)

    expect(registrations).toEqual({
      flags: [],
      mappa: {
        level: 'CAT 2/LEVEL 1',
        isNominal: false,
        lastUpdated: null,
      },
    })
  })

  it('returns risk flags', async () => {
    getRegistrationsForCrn.mockResolvedValue({
      status: 200,
      response: {
        flags: [{ code: 'IRMO', description: 'Hate Crime', colour: 'Red' }],
      },
    })

    const registrations = await getRegistrations('A123456', user)

    expect(registrations).toEqual({
      flags: [{ code: 'IRMO', description: 'Hate Crime', colour: 'Red' }],
      mappa: {
        level: null,
        isNominal: null,
        lastUpdated: null,
      },
    })
  })

  it('handles when there are no risk flags', async () => {
    getRegistrationsForCrn.mockResolvedValue({
      status: 200,
      response: {
        flags: [],
      },
    })

    const registrations = await getRegistrations('A123456', user)

    expect(registrations).toEqual({
      flags: [],
      mappa: {
        level: null,
        isNominal: null,
        lastUpdated: null,
      },
    })
  })

  it('flags when the response is 404', async () => {
    getRegistrationsForCrn.mockResolvedValue({
      status: 404,
      ok: false,
      response: {},
    })

    const registrations = await getRegistrations('A123456', user)

    expect(registrations).toEqual({
      flags: [],
      mappa: {},
    })
  })

  it('returns null when there is a failed request', async () => {
    await Promise.all(
      [400, 401, 403, 500, 501, 502, 503, 504].map(async (statusCode) => {
        getRegistrationsForCrn.mockResolvedValue({
          status: statusCode,
          ok: false,
          response: {},
        })

        const registrations = await getRegistrations('A123456', user)

        expect(registrations).toEqual({
          flags: null,
          mappa: null,
        })
      }),
    )
  })
})

describe('GetRegistrations', () => {
  it('returns ROSH risk data', async () => {
    getRoshRiskSummaryForCrn.mockResolvedValue({
      status: 200,
      ok: true,
      response: {
        overallRisk: 'HIGH',
        riskToChildrenInCommunity: 'LOW',
        riskToPublicInCommunity: 'HIGH',
        riskToKnownAdultInCommunity: 'MEDIUM',
        riskToStaffInCommunity: 'HIGH',
        lastUpdated: '2021-10-10',
      },
    })

    const riskSummary = await getRoshRiskSummary('A123456', user)

    expect(riskSummary).toEqual({
      roshRiskSummary: {
        hasBeenCompleted: true,
        lastUpdated: '10th October 2021',
        overallRisk: 'HIGH',
        riskToChildren: 'LOW',
        riskToKnownAdult: 'MEDIUM',
        riskToPublic: 'HIGH',
        riskToStaff: 'HIGH',
      },
    })
  })

  it('returns null when "NOT_KNOWN" risk', async () => {
    getRoshRiskSummaryForCrn.mockResolvedValue({
      status: 200,
      ok: true,
      response: {
        overallRisk: 'NOT_KNOWN',
        riskToChildrenInCommunity: 'NOT_KNOWN',
        riskToPublicInCommunity: 'NOT_KNOWN',
        riskToKnownAdultInCommunity: 'NOT_KNOWN',
        riskToStaffInCommunity: 'NOT_KNOWN',
        lastUpdated: '2021-10-10',
      },
    })

    const riskSummary = await getRoshRiskSummary('A123456', user)

    expect(riskSummary).toEqual({
      roshRiskSummary: {
        hasBeenCompleted: true,
        lastUpdated: '10th October 2021',
        overallRisk: null,
        riskToChildren: null,
        riskToKnownAdult: null,
        riskToPublic: null,
        riskToStaff: null,
      },
    })
  })

  it('flags as notBeenCompleted when the response is 404', async () => {
    getRoshRiskSummaryForCrn.mockResolvedValue({
      status: 404,
      ok: false,
      response: {},
    })

    const riskSummary = await getRoshRiskSummary('A123456', user)

    expect(riskSummary).toEqual({
      roshRiskSummary: {
        hasBeenCompleted: false,
      },
    })
  })

  it('returns null when the response is 400', async () => {
    await Promise.all(
      [400, 401, 403, 500, 501, 502, 503, 504].map(async (statusCode) => {
        getRoshRiskSummaryForCrn.mockResolvedValue({
          status: statusCode,
          ok: false,
          response: {},
        })

        const riskSummary = await getRoshRiskSummary('A123456', user)

        expect(riskSummary).toEqual({
          roshRiskSummary: null,
        })
      }),
    )
  })
})

describe('hasModernSlaveryFlags', () => {
  it('returns true when present', () => {
    const modernSlaveryPerpetrator = [{ code: 'MSP' }]
    const modernSlaveryVictim = [{ code: 'MSV' }]

    expect(hasModernSlaveryFlags(modernSlaveryPerpetrator)).toBe(true)
    expect(hasModernSlaveryFlags(modernSlaveryVictim)).toBe(true)
    expect(hasModernSlaveryFlags([...modernSlaveryPerpetrator, ...modernSlaveryVictim])).toBe(true)
  })

  it('returns false when not present', () => {
    const flags = []

    expect(hasModernSlaveryFlags(flags)).toBe(false)
  })

  it('handles when flags are undefined', () => {
    const flags = undefined

    expect(hasModernSlaveryFlags(flags)).toBe(false)
  })
})
