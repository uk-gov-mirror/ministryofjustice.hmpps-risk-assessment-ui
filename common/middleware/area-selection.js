const { getUserProfile } = require('../data/offenderAssessmentApi')
const { cacheUserDetailsWithRegion } = require('../data/userDetailsCache')
const { getApiToken } = require('../data/oauth')
const logger = require('../logging/logger')
const { STANDALONE_ASSESSMENTS } = require('../utils/constants')

const checkAssessmentType = () => async (req, res, next) => {
  let standaloneAssessment = false
  if (STANDALONE_ASSESSMENTS.includes(req.query.assessmentType)) {
    standaloneAssessment = true
  } else {
    const assessmentType = req.originalUrl?.split('/')[1].toUpperCase()
    if (STANDALONE_ASSESSMENTS.includes(assessmentType)) {
      standaloneAssessment = true
    }
  }

  req.session.standaloneAssessment = standaloneAssessment
  req.session.save()

  return next()
}

const checkUserHasAreaSelected = overrideUrl => async (req, res, next) => {
  try {
    const { user } = req
    if (!req.session.standaloneAssessment) {
      if (user && (user.areaCode === undefined || user.areaCode === null)) {
        const apiToken = await getApiToken()
        const { regions } = await getUserProfile(user.oasysUserCode, apiToken)
        if (regions.length === 1) {
          await cacheUserDetailsWithRegion(user.id, regions[0].code, regions[0].name)
          req.session.regions = regions
          req.session.save()
        } else {
          req.session.regions = regions
          req.session.redirectUrl = overrideUrl || req.originalUrl
          req.session.save()
          return res.redirect(`/area-selection`)
        }
      }
    }

    return next()
  } catch (error) {
    logger.error(`Unable to check user has area selected, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = {
  checkUserHasAreaSelected,
  checkAssessmentType,
}
