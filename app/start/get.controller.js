const {
  dev: { devAssessmentId },
} = require('../../common/config')

const startController = async (req, res) => {
  return res.render(`${__dirname}/index`, { assessmentId: devAssessmentId })
}

module.exports = { startController }
