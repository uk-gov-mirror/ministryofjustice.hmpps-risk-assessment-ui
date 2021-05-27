const { stubFor, resetStubs } = require('./wiremock')
const {
  stubForms,
  stubSupervision,
  stubQuestions,
  stubQuestionSummaries,
  stubAnswers,
  stubEpisodes,
  stubOffenderDetails,
  stubAssessmentComplete,
  stubGetAssessments,
  stubGetQuestionGroup,
} = require('./assessmentApi')
const { stubGetAssessmentFromDelius, stubPostAssessmentFromDelius } = require('./assessmentFromDelius')
const { stubStart } = require('./start')
const { stubReferenceData } = require('./referenceData')
const { stubGetToken } = require('./oauth')
const { stubOasysUser } = require('./oasysUser')

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
  await stubSupervision()
  await stubForms()
  await stubQuestions()
  await stubQuestionSummaries()
  await stubAnswers()
  await stubEpisodes()
  await stubGetToken()
  await stubAssessmentComplete()
  await stubGetAssessmentFromDelius()
  await stubPostAssessmentFromDelius()
  await stubStart()
  await stubGetAssessments()
  await stubGetQuestionGroup()
  await stubReferenceData()
  await stubOasysUser()
  stubOffenderDetails()
}

stub()
