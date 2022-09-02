const { stubFor, resetStubs } = require('./wiremock')
const {
  stubSupervision,
  stubQuestions,
  stubAnswers,
  stubEpisodes,
  stubOffenderDetails,
  stubOffenderAndOffenceDetails,
  stubAssessmentComplete,
  stubGetAssessments,
  stubGetQuestionGroup,
  stubAssessmentQuestions,
  stubPredictors,
  stubRegistrations,
  stubRoshRiskSummary,
  stubDocumentUpload,
  stubCloseAssessment,
} = require('./assessmentApi')
const { stubGetAssessmentFromDelius, stubPostAssessmentFromDelius } = require('./assessmentFromDelius')
const { stubStart } = require('./start')
const { stubGetToken } = require('./oauth')
const { stubGetUserProfile, stubOasysUser } = require('./oasysUser')

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
  await stubQuestions()
  await stubAnswers()
  await stubEpisodes()
  await stubGetToken()
  await stubAssessmentComplete()
  await stubGetAssessmentFromDelius()
  await stubPostAssessmentFromDelius()
  await stubStart()
  await stubGetAssessments()
  await stubGetQuestionGroup()
  await stubOasysUser()
  await stubOffenderDetails()
  await stubOffenderAndOffenceDetails()
  await stubGetUserProfile()
  await stubAssessmentQuestions()
  await stubPredictors()
  await stubRegistrations()
  await stubRoshRiskSummary()
  await stubDocumentUpload()
  await stubCloseAssessment()
}

stub()
