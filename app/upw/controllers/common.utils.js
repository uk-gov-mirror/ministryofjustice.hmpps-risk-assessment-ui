const { getRegistrationsForCrn, getRoshRiskSummaryForCrn } = require('../../../common/data/hmppsAssessmentApi')
const logger = require('../../../common/logging/logger')
const { prettyDate } = require('../../../common/utils/util')

const whereStringNotNull = s => s !== null

const formatMappaCode = (code, prefix) => {
  const suffixes = {
    M1: '1',
    M2: '2',
    M3: '3',
  }

  const suffix = suffixes[code]

  return suffix ? `${prefix} ${suffix}` : null
}

const formatMappaCodes = ({ category, level } = {}) => {
  if (!category && !level) {
    return null
  }

  return [formatMappaCode(category, 'CAT'), formatMappaCode(level, 'LEVEL')].filter(whereStringNotNull).join('/')
}

const formatMappaResponse = (mappaResponse = {}) => ({
  level: formatMappaCodes(mappaResponse),
  isNominal: mappaResponse.level ? mappaResponse.level === 'M0' : null,
  lastUpdated: prettyDate(mappaResponse?.startDate),
})

const formatFlag = flag => flag.description || null

const getRegistrations = async (crn, user) => {
  try {
    const { response, status } = await getRegistrationsForCrn(crn, user)

    if (status === 404) {
      return {
        flags: [],
        mappa: {},
      }
    }

    if (status >= 400) {
      return {
        mappa: null,
        flags: null,
      }
    }

    return {
      mappa: formatMappaResponse(response.mappa),
      flags: response.flags.map(formatFlag).filter(whereStringNotNull),
    }
  } catch (error) {
    logger.info(`Failed to fetch registrations for CRN ${crn}`)
    return { mappa: null, flags: null }
  }
}

const getRoshRiskSummary = async (crn, user) => {
  try {
    const { response, status } = await getRoshRiskSummaryForCrn(crn, user)

    const nullIfNotKnown = s => (s === 'NOT_KNOWN' ? null : s)

    if (status === 404) {
      return {
        roshRiskSummary: { hasBeenCompleted: false },
      }
    }

    if (status >= 400) {
      return {
        roshRiskSummary: null,
      }
    }

    return {
      roshRiskSummary: {
        hasBeenCompleted: true,
        overallRisk: nullIfNotKnown(response.overallRisk),
        riskToChildren: nullIfNotKnown(response.riskToChildrenInCommunity),
        riskToPublic: nullIfNotKnown(response.riskToPublicInCommunity),
        riskToKnownAdult: nullIfNotKnown(response.riskToKnownAdultInCommunity),
        riskToStaff: nullIfNotKnown(response.riskToStaffInCommunity),
        lastUpdated: prettyDate(response.lastUpdated),
      },
    }
  } catch (error) {
    logger.info(`Failed to fetch ROSH risk summary for CRN ${crn}`)
    return { roshRiskSummary: null }
  }
}

module.exports = {
  getRegistrations,
  getRoshRiskSummary,
}
