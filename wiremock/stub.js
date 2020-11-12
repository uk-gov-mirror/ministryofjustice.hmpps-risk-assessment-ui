const { stubFor, resetStubs } = require('./wiremock')
const { stubForms, stubQuestions, stubAnswers, stubEpisodes } = require('./assessmentApi')
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

  stubForms()
  stubQuestions()
  stubAnswers()
  stubEpisodes()
  stubGetToken()
}

stub()
