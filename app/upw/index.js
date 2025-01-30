const { Router } = require('express')
const wizard = require('hmpo-form-wizard')
const steps = require('./steps')
const { fields } = require('./fields')
const config = require('./upw_config')
const { sanitise } = require('../../common/middleware/sanitise')

const router = Router()

router.get('*splat', (req, res, next) => {
  res.locals.pageTitle = steps[req.url]?.pageTitle
  res.locals.feedbackUrl = config.feedback_banner.url || ''
  next()
})

router.get('*splat', (req, res, next) => {
  res.locals.previousUrl = req.session.previousUrl
  if (req.session.previousUrl !== req.originalUrl) {
    req.session.previousUrl = req.originalUrl
  }
  next()
})

router.use(
  wizard(steps, fields, {
    journeyName: 'UPW',
    journeyPageTitle: 'Community payback assessment',
    name: 'UPW',
    entryPoint: true,
    preControllerMiddleware: sanitise(),
  }),
)

module.exports = router
