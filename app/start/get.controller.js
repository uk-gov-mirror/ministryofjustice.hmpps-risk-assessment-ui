// const { logger } = require('../../common/logging/logger')

const {
  dev: { devAssessmentId },
} = require('../../common/config')

const startController = (req, res) => {
  res.render(`${__dirname}/index`, { assessmentId: devAssessmentId })
}

module.exports = { startController }
