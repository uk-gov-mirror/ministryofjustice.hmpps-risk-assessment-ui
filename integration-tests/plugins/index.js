const { resetStubs } = require('../../wiremock/wiremock')
const { stubForms, stubQuestions, stubAnswers, stubEpisodes } = require('../../wiremock/assessmentApi')
const oauthApi = require('../../wiremock/oauth')

module.exports = on => {
  on('task', {
    reset: resetStubs,
    stubAssessmentApi: () => Promise.all([stubQuestions(), stubForms(), stubAnswers(), stubEpisodes()]),
    stubAuth: () => Promise.all([oauthApi.stubGetToken()]),
  })
}
