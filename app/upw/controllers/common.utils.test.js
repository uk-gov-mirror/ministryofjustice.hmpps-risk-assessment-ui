const { getRegistrationsForCrn, getRoshRiskSummaryForCrn } = require('../../../common/data/hmppsAssessmentApi')
const { getRegistrations, getRoshRiskSummary } = require('./common.utils')

jest.mock('../../../common/data/hmppsAssessmentApi')

const user = { id: 1, token: 'FOO_TOKEN' }

describe('GetRegistrations', () => {
  it('returns MAPPA data', async () => {
    getRegistrationsForCrn.mockResolvedValue([
      true,
      {
        mappa: {
          level: 'M1',
          levelDescription: 'MAPPA Level 1',
          category: 'M2',
          categoryDescription: 'MAPPA Cat 2',
          startDate: '2021-10-10',
        },
        flags: [],
      },
    ])

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
    getRegistrationsForCrn.mockResolvedValue([
      true,
      {
        flags: [],
      },
    ])

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
    getRegistrationsForCrn.mockResolvedValue([
      true,
      {
        mappa: {
          level: 'M1',
          levelDescription: 'MAPPA Level 1',
          startDate: '2021-10-10',
        },
        flags: [],
      },
    ])

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
    getRegistrationsForCrn.mockResolvedValue([
      true,
      {
        mappa: {
          category: 'M2',
          categoryDescription: 'MAPPA Cat 2',
          startDate: '2021-10-10',
        },
        flags: [],
      },
    ])

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
    getRegistrationsForCrn.mockResolvedValue([
      true,
      {
        mappa: {
          level: 'M1',
          levelDescription: 'MAPPA Level 1',
          category: 'M2',
          categoryDescription: 'MAPPA Cat 2',
        },
        flags: [],
      },
    ])

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
    getRegistrationsForCrn.mockResolvedValue([
      true,
      {
        flags: [{ code: 'IRMO', description: 'Hate Crime', colour: 'Red' }],
      },
    ])

    const registrations = await getRegistrations('A123456', user)

    expect(registrations).toEqual({
      flags: ['Hate Crime'],
      mappa: {
        level: null,
        isNominal: null,
        lastUpdated: null,
      },
    })
  })

  it('handles when there are no risk flags', async () => {
    getRegistrationsForCrn.mockResolvedValue([
      true,
      {
        flags: [],
      },
    ])

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
})

describe('GetRegistrations', () => {
  it('returns ROSH risk data', async () => {
    getRoshRiskSummaryForCrn.mockResolvedValue([
      true,
      {
        overallRisk: 'HIGH',
        riskToChildrenInCommunity: 'LOW',
        riskToPublicInCommunity: 'HIGH',
        riskToKnownAdultInCommunity: 'MEDIUM',
        riskToStaffInCommunity: 'HIGH',
        lastUpdated: '2021-10-10',
      },
    ])

    const riskSummary = await getRoshRiskSummary('A123456', user)

    expect(riskSummary).toEqual({
      roshRiskSummary: {
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
    getRoshRiskSummaryForCrn.mockResolvedValue([
      true,
      {
        overallRisk: 'NOT_KNOWN',
        riskToChildrenInCommunity: 'NOT_KNOWN',
        riskToPublicInCommunity: 'NOT_KNOWN',
        riskToKnownAdultInCommunity: 'NOT_KNOWN',
        riskToStaffInCommunity: 'NOT_KNOWN',
        lastUpdated: '2021-10-10',
      },
    ])

    const riskSummary = await getRoshRiskSummary('A123456', user)

    expect(riskSummary).toEqual({
      roshRiskSummary: {
        lastUpdated: '10th October 2021',
        overallRisk: null,
        riskToChildren: null,
        riskToKnownAdult: null,
        riskToPublic: null,
        riskToStaff: null,
      },
    })
  })
})
