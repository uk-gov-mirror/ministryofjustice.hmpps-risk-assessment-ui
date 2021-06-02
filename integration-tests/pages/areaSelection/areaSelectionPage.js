const page = require('../page')

const areaSelectionPage = () =>
  page('List of areas', {
    startAssessmentButton: () => cy.get('.govuk-button'),
  })

export default {
  verifyOnPage: areaSelectionPage,
  selectRegion: (regionNamePrefix, regionName) => {
    cy.get('#area')
      .clear()
      .type(regionNamePrefix)
    cy.contains('li', regionName).click()
  },
  goTo: () => {
    cy.visit(`/area-selection`)
    return areaSelectionPage()
  },
}
