const { logger } = require('../../common/logging/logger')

const startController = (req, res) => {
  console.log('wot wot wot')
  res.render(`${__dirname}/index`)
}

module.exports = { startController }
