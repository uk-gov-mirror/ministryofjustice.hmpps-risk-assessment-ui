const { stubFor, resetStubs } = require('./wiremock')
const { stubQuestions, stubAnswers } = require('./assessmentApi')
const { stubGetToken } = require('./oauth')

async function stub() {
  await resetStubs()

  stubFor({
    request: {
      method: 'GET',
      url: '/ping',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/text;charset=UTF-8',
      },
      body: 'ping',
    },
  })

  stubQuestions()
  stubAnswers()
  stubGetToken()
}

stub()
