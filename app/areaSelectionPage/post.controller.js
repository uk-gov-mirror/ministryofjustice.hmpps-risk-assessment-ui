const { cacheUserDetailsWithRegion } = require('../../common/data/userDetailsCache')

const {
  dev: { devAssessmentId },
} = require('../../common/config')

const redirectToAssessmentList = async (req, res) => {
  try {
    const { user } = req
    const areaInfo = JSON.parse(req.body.area)

    await cacheUserDetailsWithRegion(user.id, areaInfo.areaCode, areaInfo.areaName)

    return res.redirect(`/${devAssessmentId}/assessments`)
  } catch (error) {
    return res.render('app/error', { error })
  }
}

module.exports = {
  redirectToAssessmentList,
}
