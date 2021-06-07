const { cacheUserDetailsWithRegion } = require('../../common/data/userDetailsCache')

const redirectToAssessmentList = async (req, res) => {
  try {
    const { user } = req
    const areaInfo = JSON.parse(req.body.area)

    await cacheUserDetailsWithRegion(user.id, areaInfo.areaCode, areaInfo.areaName)

    const redirectUrl = req.session.redirectUrl || '/'
    delete req.session.redirectUrl
    req.session.save()

    return res.redirect(redirectUrl)
  } catch (error) {
    return res.render('app/error', { error })
  }
}

module.exports = {
  redirectToAssessmentList,
}
