import logger from '../logging/logger'
import { getOffenderData } from '../data/hmppsAssessmentApi'

export default async ({ params: { assessmentId }, user }, res, next) => {
  try {
    const { name, pnc = null, crn = null, dob, age } = await getOffenderData(assessmentId, user?.token)
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
