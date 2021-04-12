const { stubFor, resetStubs } = require('./wiremock')
const {
  stubForms,
  stubQuestions,
  stubQuestionSummaries,
  stubAnswers,
  stubEpisodes,
  stubOffenderDetails,
  stubAssessmentComplete,
} = require('./assessmentApi')
const { stubReferenceData } = require('./referenceData')
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

  await stubForms()
  await stubQuestions()
  await stubQuestionSummaries()
  await stubAnswers()
  await stubEpisodes()
  await stubGetToken()
  await stubAssessmentComplete()
  await stubReferenceData()
  stubOffenderDetails()
}

stub()
