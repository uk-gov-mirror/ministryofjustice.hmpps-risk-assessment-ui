const crn = 'dl > :nth-child(2)'
const pnc = 'dl > :nth-child(4)'
const dateOfBirth = 'dl > :nth-child(4)'
const offendersName = '.key-details-bar__name'
const offence = ':nth-child(1) > .govuk-table__cell'
const subCode = ':nth-child(2) > .govuk-table__cell'
const sentenceDate = ':nth-child(3) > .govuk-table__cell'
const descriptionList = 'dl'

module.exports = {
  crn: () => cy.get(crn),
  pnc: () => cy.get(pnc),
  dateOfBirth: () => cy.get(dateOfBirth),
  offendersName: () => cy.get(offendersName),
  offence: () => cy.get(offence),
  subCode: () => cy.get(subCode),
  sentenceDate: () => cy.get(sentenceDate),
  descriptionList: () => cy.get(descriptionList),
}
