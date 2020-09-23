// const { logger } = require('../../common/logging/logger')

const startController = (req, res) => {
  res.render(`${__dirname}/index`)
}

module.exports = { startController }
