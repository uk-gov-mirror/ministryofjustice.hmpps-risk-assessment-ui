const { Given, When, Then } = require('@badeball/cypress-cucumber-preprocessor')
const querystring = require('querystring')
const ArnHomePage = require('../../../integration/pages/homePage/ARNHomePage')
const urls = require('../../../fixtures/urls.json')
const AreaSelectionPage = require('../../../integration/pages/areaSelection/areaSelectionPage')
const Common = require('../../../integration/pages/upwPages/common/common')
const TaskListPage = require('../../../integration/pages/upwPages/taskList/taskListPage')

Given('I login and navigate to UPW Task list page with CRN {string}', (crn) => {
  ArnHomePage.signIn(crn)
  const params = querystring.encode({
    crn,
    assessmentType: 'UPW',
    eventId: 1,
  })
  cy.visit(`${urls.startAssessment}?${params}`)
  AreaSelectionPage.startAssessmentButton().click()
})

Given('I login and navigate to UPW Task list page with dataDriven CRN', () => {
  const mycrn = Common.getLocalCrn()
  ArnHomePage.signIn(mycrn)
  cy.wrap(mycrn).as('crn')
  cy.log(`CRN -> ${mycrn}`)
  const params = querystring.encode({
    crn: mycrn,
    assessmentType: 'UPW',
    eventId: 1,
  })
  cy.visit(`${urls.startAssessment}?${params}`)
  AreaSelectionPage.startAssessmentButton().click()
})

Given('I login and navigate to UPW Task list page with full dataDriven CRN', () => {
  const mycrn = Common.getLocalCrn('Y')
  ArnHomePage.signIn(mycrn)
  cy.wrap(mycrn).as('crn')
  cy.log(`CRN -> ${mycrn}`)
  const params = querystring.encode({
    crn: mycrn,
    assessmentType: 'UPW',
    eventId: 1,
  })
  cy.visit(`${urls.startAssessment}?${params}`)
  AreaSelectionPage.startAssessmentButton().click()
})

Given('I login and navigate to UPW Task list page with dataDriven CRN by injecting Axe', () => {
  const mycrn = Common.getLocalCrn()
  ArnHomePage.signIn(mycrn)
  cy.log(`CRN -> ${mycrn}`)
  const params = querystring.encode({
    crn: mycrn,
    assessmentType: 'UPW',
    eventId: 1,
  })
  cy.visit(`${urls.startAssessment}?${params}`).injectAxe()
  AreaSelectionPage.startAssessmentButton().click()
})

Given('I login and navigate to UPW Task list page for cloned assessment', () => {
  cy.get('@crn').then((crn) => {
    const params = querystring.encode({
      crn,
      assessmentType: 'UPW',
      eventId: 1,
    })
    cy.visit(`${urls.startAssessment}?${params}`)
    AreaSelectionPage.startAssessmentButton().click()
  })
})

When('I verify the following links are available & working on the {string}', (pageName, dataTable) => {
  const pages = dataTable.hashes()
  pages.forEach((page) => {
    cy.get(TaskListPage.sectionTag).should('contain.text', page.Status.toLowerCase())
    cy.get(TaskListPage.sectionLink).contains(page['Link Name']).click()
    cy.get(Common.pageHeader).should('contain.text', page['Page to be displayed on clicking the Link'])
    cy.get(TaskListPage.backLink).click()
    cy.get(Common.pageHeader).should('contain.text', 'Community payback assessment')
  })
})

When('I verify the {string} Section on the task list page', (sectionName, dataTable) => {
  cy.get('li').should('contain.text', sectionName)
  cy.get('li, #main-content li:nth-child(7)').as('task')
  cy.get('@task').should('contain.text', dataTable.hashes()[0].Status)
  cy.get('@task').should('contain.text', dataTable.hashes()[0]['Task list name'])
})

When('I click on the {string} link', (linkName) => {
  cy.get('.task-list__task-name').contains(linkName).click()
})

Then('I see UPW {string} page', (pageHeader) => {
  cy.get(Common.pageHeader).should('contain.text', pageHeader)
})

When('I see the {string} link is marked as {string}', (linkName, status) => {
  cy.get('li').contains(linkName).as('task')
  cy.get('@task').get('li').should('contain.text', status.toLowerCase())
})

When('I click on Submit Button', () => {
  TaskListPage.clickSubmitButton()
})

When('I click on Save and close Button', () => {
  TaskListPage.clickSaveAndCloseButton()
})
