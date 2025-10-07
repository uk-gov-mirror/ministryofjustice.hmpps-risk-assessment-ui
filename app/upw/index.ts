import { Router } from 'express'
import wizard from 'hmpo-form-wizard'
import steps from './steps'
import { fields } from './fields'
import config from './upw_config'
import { sanitise } from '../../common/middleware/sanitise'

export default function setupRouter(): Router {
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

  return router
}
