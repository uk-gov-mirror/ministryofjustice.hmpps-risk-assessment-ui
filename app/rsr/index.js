const { Router } = require('express')
const wizard = require('hmpo-form-wizard')
const steps = require('./steps')
const { fields } = require('./fields')
const getOffenderDetails = require('../../common/middleware/getOffenderDetails')

const router = Router()

router.get('*', (req, res, next) => {
  res.locals.pageTitle = steps[req.url]?.pageTitle
  next()
})

router.get('/offences-and-convictions', getOffenderDetails)
router.get('/needs', getOffenderDetails)

router.use(
  wizard(steps, fields, {
    journeyName: 'rsr',
    journeyPageTitle: 'Risk of Serious Recidivism (RSR) assessment',
    name: 'rsr',
    entryPoint: true,
  }),
)

module.exports = router
