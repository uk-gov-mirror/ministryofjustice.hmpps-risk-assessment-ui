const { resetStubs } = require('../../wiremock/wiremock')
const assessmentApi = require('../../wiremock/assessmentApi')

module.exports = on => {
  on('task', {
    reset: resetStubs,
    stubQuestionResponses: () => Promise.all([assessmentApi.stubQuestions()]),
  })
}
