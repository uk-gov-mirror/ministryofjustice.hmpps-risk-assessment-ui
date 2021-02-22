// eslint-disable-next-line import/no-extraneous-dependencies
import 'cypress-audit/commands'

Cypress.Commands.add('login', (url = '/') => {
  cy.request(url)
  cy.task('getLoginUrl').then(cy.visit)
})

// note we're hiding the inputs with aria-expanded to avoid this bug in the
// govuk frontend component: https://github.com/alphagov/govuk-frontend/issues/979
// Will be able to remove once this is fixed in the templates.
Cypress.Commands.add('checkA11y', () => {
  cy.pa11y({
    standard: 'WCAG2AA',
    hideElements: '.govuk-footer__copyright-logo, input[aria-expanded]',
    includeWarnings: true,
  })
})
