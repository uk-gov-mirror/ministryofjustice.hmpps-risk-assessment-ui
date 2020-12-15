const logger = require('../logging/logger')
const { getOffenderData } = require('../data/assessmentApi')
const {
  dev: { devAssessmentId },
} = require('../config')

module.exports = async ({ tokens }, res, next) => {
  try {
    const { name, pnc = null, crn = null, dob, age } = await getOffenderData(devAssessmentId, tokens)
    if (!name) throw new Error('Required offender details could not be found')
    res.locals.offenderDetails = {
      name,
      crn,
      pnc,
      age,
      dob,
    }
    return next()
  } catch (error) {
    logger.error(`Could not retrieve offender details, error: ${error}`)
    return res.render('app/error', { error })
  }
}
