// eslint-disable-next-line import/no-extraneous-dependencies
const { lighthouse, pa11y, prepareAudit } = require('cypress-audit')
const { resetStubs } = require('../../wiremock/wiremock')
const { stubForms, stubQuestions, stubAnswers, stubEpisodes } = require('../../wiremock/assessmentApi')
const oauthApi = require('../../wiremock/oauth')

module.exports = on => {
  // eslint-disable-next-line no-unused-vars
  on('before:browser:launch', (browser = {}, launchOptions) => {
    prepareAudit(launchOptions)
  })

  on('task', {
    lighthouse: lighthouse(),
    pa11y: pa11y(), // calling the function is important
    reset: resetStubs,
    stubAssessmentApi: () => Promise.all([stubQuestions(), stubForms(), stubAnswers(), stubEpisodes()]),
    stubAuth: () => Promise.all([oauthApi.stubGetToken()]),
  })
}
