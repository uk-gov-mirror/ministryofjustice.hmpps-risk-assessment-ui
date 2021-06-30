const { cacheUserDetailsWithRegion } = require('../../common/data/userDetailsCache')

const redirectToAssessmentList = async (req, res) => {
  try {
    const { user } = req
    const requestedArea = JSON.parse(req.body.area)

    const providedOptions = req.session.regions || []

    const isValidUserRegion = providedOptions.map(({ code }) => code).includes(requestedArea.areaCode)

    if (isValidUserRegion) {
      await cacheUserDetailsWithRegion(user.id, requestedArea.areaCode, requestedArea.areaName)

      const redirectUrl = req.session.redirectUrl || '/'
      delete req.session.redirectUrl
      req.session.save()

      return res.redirect(redirectUrl)
    }
    return res.render(`${__dirname}/index`, {
      areas: {
        error: 'Enter a valid area',
        options: providedOptions.map(({ name, code }) => ({
          text: name,
          value: JSON.stringify({ areaName: name, areaCode: code }),
        })),
      },
    })
  } catch (error) {
    return res.render('app/error', { error })
  }
}

module.exports = {
  redirectToAssessmentList,
}
