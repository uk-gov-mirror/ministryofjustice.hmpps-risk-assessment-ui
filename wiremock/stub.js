const { stubFor, resetStubs } = require('./wiremock')
const {
  stubForms,
  stubSupervision,
  stubQuestions,
  stubQuestionSummaries,
  stubAnswers,
  stubEpisodes,
  stubOffenderDetails,
  stubOffenderAndOffenceDetails,
  stubAssessmentComplete,
  stubGetAssessments,
  stubGetQuestionGroup,
  stubAssessmentTypeSummaries,
  stubAssessmentQuestions,
  stubPredictors,
  stubRegistrations,
  stubRoshRiskSummary,
  stubDocumentUpload,
  stubCloseAssessment,
} = require('./assessmentApi')
const { stubGetAssessmentFromDelius, stubPostAssessmentFromDelius } = require('./assessmentFromDelius')
const { stubStart } = require('./start')
const { stubReferenceData } = require('./referenceData')
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
  await stubForms()
  await stubQuestions()
  await stubQuestionSummaries()
  await stubAssessmentTypeSummaries()
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
