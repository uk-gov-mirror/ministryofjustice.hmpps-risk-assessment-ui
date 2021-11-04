const { format } = require('date-fns')
const { getRegistrationsForCrn } = require('../../../common/data/hmppsAssessmentApi')
const logger = require('../../../common/logging/logger')

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

const formatDate = date => {
  return date ? format(new Date(date), 'do MMMM y') : null
}

const formatMappaCodes = ({ category, level } = {}) => {
  if (!category && !level) {
    return null
  }

  return [formatMappaCode(category, 'CAT'), formatMappaCode(level, 'LEVEL')].filter(whereStringNotNull).join('/')
}

const formatMappaResponse = mappaResponse => ({
  level: formatMappaCodes(mappaResponse),
  lastUpdated: formatDate(mappaResponse?.startDate),
})

const formatFlag = flag => flag.description || null

const getRegistrations = async (crn, user) => {
  const [ok, response] = await getRegistrationsForCrn(crn, user?.token, user?.id)

  if (!ok) {
    logger.info(`Failed to fetch registrations for CRN ${crn}`)
    return { flags: [] }
  }

  return {
    mappa: formatMappaResponse(response.mappa),
    flags: response.flags.map(formatFlag).filter(whereStringNotNull),
  }
}

module.exports = {
  getRegistrations,
}
