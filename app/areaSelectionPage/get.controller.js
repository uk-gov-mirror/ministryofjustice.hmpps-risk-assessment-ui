const { logger } = require('../../common/logging/logger')
const { getUserProfile } = require('../../common/data/offenderAssessmentApi')

const areaSelectionController = async (req, res) => {
  try {
    const [flashRegions] = req.flash('regions')
    let regions = typeof flashRegions === 'string' ? JSON.parse(flashRegions) : []
    if (regions.length === 0) {
      const userProfile = await getUserProfile(req.user?.oasysUserCode, req.user?.token)
      regions = userProfile.regions
    }
    return res.render(`${__dirname}/index`, {
      areas: regions.map(({ name, code }) => ({
        text: name,
        value: JSON.stringify({ areaName: name, areaCode: code }),
      })),
    })
  } catch (error) {
    logger.error(`Area selection, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { areaSelectionController }
