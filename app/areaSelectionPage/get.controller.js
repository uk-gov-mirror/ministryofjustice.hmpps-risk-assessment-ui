const { logger } = require('../../common/logging/logger')
const { getUserProfile } = require('../../common/data/offenderAssessmentApi')
const { getApiToken } = require('../../common/data/oauth')

const areaSelectionController = async (req, res) => {
  try {
    let regions = req.session.regions || []
    if (regions.length === 0) {
      const apiToken = await getApiToken()
      const userProfile = await getUserProfile(req.user?.oasysUserCode, apiToken)
      regions = userProfile.regions
    }
    return res.render(`${__dirname}/index`, {
      areas: {
        options: regions.map(({ name, code }) => ({
          text: name,
          value: JSON.stringify({ areaName: name, areaCode: code }),
        })),
      },
    })
  } catch (error) {
    logger.error(`Area selection, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { areaSelectionController }
