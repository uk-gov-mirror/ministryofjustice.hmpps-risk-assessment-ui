const { When } = require('@badeball/cypress-cucumber-preprocessor')

const lighthouseThresholds = {
  performance: 50,
  accessibility: 50,
  'best-practices': 70,
  'first-contentful-paint': 2000,
  'largest-contentful-paint': 3000,
  'cumulative-layout-shift': 0.1,
  'total-blocking-time': 500,
  interactive: 2000,
  seo: 80,
  pwa: 50,
}

const lighthouseConfig = {
  formFactor: 'desktop',
  screenEmulation: { disabled: true },
}

When(/^user checks for accessibility violations$/, () => {
  cy.injectAxe()
  cy.checkA11y(null, null, null, true)
})

When(/^user checks for performance metrics using lighthouse$/, () => {
  cy.lighthouse(lighthouseThresholds, lighthouseConfig)
})

When(/^user checks for accessibility audit using pa11y$/, () => {
  cy.pa11y({ hideElements: 'body' })
})
