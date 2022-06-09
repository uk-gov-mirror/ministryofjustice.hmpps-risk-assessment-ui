const appInsights = require('applicationinsights')

const trackEvent = (eventName, req = {}, customProperties = {}) => {
  const assessmentInfo = req.session?.assessment

  const client = appInsights.defaultClient
  if (client && eventName) {
    const eventProperties = {
      ...customProperties,
      assessmentUUID: assessmentInfo?.uuid,
      episodeUUID: assessmentInfo?.episodeUuid,
      crn: assessmentInfo?.subject?.crn,
      author: req.user?.username,
    }
    client.trackEvent({ name: eventName, properties: { ...eventProperties } })
  }
}

module.exports = { trackEvent }
