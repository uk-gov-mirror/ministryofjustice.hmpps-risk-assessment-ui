const { getRegistrationsForCrn } = require('../../../common/data/hmppsAssessmentApi')
const { getRegistrations } = require('./common.utils')

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
        lastUpdated: null,
      },
    })
  })
})
