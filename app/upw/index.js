const { Router } = require('express')
const wizard = require('hmpo-form-wizard')
const steps = require('./steps')
const { fields } = require('./fields')

const router = Router()

router.get('*', (req, res, next) => {
  res.locals.pageTitle = steps[req.url]?.pageTitle
  next()
})

router.use(
  wizard(steps, fields, {
    journeyName: 'UPW',
    journeyPageTitle: 'Community payback assessment',
    name: 'UPW',
    entryPoint: true,
  }),
)

module.exports = router
