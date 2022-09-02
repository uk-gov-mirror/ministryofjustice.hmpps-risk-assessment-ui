const { stubFor } = require('./wiremock')
const assessmentQuestions = require('./responses/assessmentQuestions.json')
const questionAnswers = require('./responses/questionAnswers.json')
const assessmentEpisodes = require('./responses/assessmentEpisodes.json')
const currentEpisodeByCrn = require('./responses/currentEpisodeByCrn.json')
const offenderDetails = require('./responses/offenderDetails.json')
const offenderAndOffenceDetails = require('./responses/offenderAndOffenceDetails.json')
const assessmentSupervision = require('./responses/assessmentSupervision.json')
const updateEpisode = require('./responses/updateEpisode.json')
const predictors = require('./responses/predictors.json')
const registrations = require('./responses/registrations.json')
const roshRiskSummary = require('./responses/roshRiskSummary.json')

const stubGetAssessments = () => {
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/.+?/assessments`,
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 200,
      jsonBody: {},
    },
  })
}

const stubGetQuestionGroup = () => {
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/.+?/questiongroup/.+?/summary`,
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 200,
      jsonBody: {},
    },
  })
}

const stubOffenderDetails = () => {
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/assessments/.+?/subject`,
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 200,
      jsonBody: offenderDetails,
    },
  })
}

const stubOffenderAndOffenceDetails = () => {
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/offender/crn/.+?/eventType/.+?/eventId/.+?`,
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 200,
      jsonBody: offenderAndOffenceDetails,
    },
  })

  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/offender/crn/.+?/eventId/.+?`,
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 200,
      jsonBody: offenderAndOffenceDetails,
    },
  })
}

const stubAssessmentSupervision = () => {
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/assessments',
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 200,
      jsonBody: assessmentSupervision,
    },
  })
}

const stubAssessmentComplete = () => {
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/assessments/.+?/complete',
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 200,
      jsonBody: assessmentEpisodes,
    },
  })

  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/assessments/.+?/episodes/.+?/complete',
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 200,
      jsonBody: assessmentEpisodes,
    },
  })
}

const stubAssessmentQuestions = (assessmentCode) => {
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/assessments/${assessmentCode}/questions`,
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 200,
      jsonBody: assessmentQuestions[assessmentCode],
    },
  })
}

const stubAnswersGroup = (groupId) => {
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/answers/${groupId}`,
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 200,
      jsonBody: questionAnswers[groupId],
    },
  })
}
const stubAssessmentEpisodes = () => {
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/assessments/subject/.+?/episodes/current`,
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 200,
      jsonBody: currentEpisodeByCrn,
    },
  })

  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/assessments/.+?/episodes/.+?`,
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 200,
      jsonBody: assessmentEpisodes,
    },
  })
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/assessments/.+?/episodes/.+?`,
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 200,
      jsonBody: updateEpisode,
    },
  })
}

const stubPredictors = () => {
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/risks/predictors/episodes/.+?`,
      queryParameters: {
        final: {
          equalTo: 'false',
        },
      },
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 200,
      jsonBody: predictors.default,
    },
  })
}

const stubRegistrations = () => {
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/assessments/.+?/registrations`,
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 200,
      jsonBody: registrations,
    },
  })
}

const stubRoshRiskSummary = () => {
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/assessments/.+?/ROSH/summary`,
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 200,
      jsonBody: roshRiskSummary,
    },
  })
}

const stubDocumentUpload = () => {
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/assessments/.+?/episode/.+?/document`,
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 200,
      jsonBody: {},
    },
  })
}

const stubCloseAssessment = () => {
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/assessments/.+?/episodes/.+?/close`,
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 200,
    },
  })
}

const stubQuestions = async () => {
  await stubAssessmentQuestions('UPW', 1)
}

const stubAnswers = async () => {
  await stubAnswersGroup(1234)
}

const stubEpisodes = async () => {
  await stubAssessmentEpisodes()
}

const stubSupervision = async () => {
  await stubAssessmentSupervision()
}

const stubErrors = () => {
  stubFor({
    request: {
      method: 'ANY',
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 503,
      jsonBody: {
        status: 503,
        developerMessage: 'Unable to create assessment',
        reason: 'OASYS_PERMISSIONS',
        moreInfo:
          'GEORGE CLARKE in Warwickshire is currently doing an assessment on this offender, created on 12/04/2021.',
      },
    },
  })
}

module.exports = {
  stubSupervision,
  stubQuestions,
  stubAnswers,
  stubEpisodes,
  stubOffenderDetails,
  stubOffenderAndOffenceDetails,
  stubAssessmentComplete,
  stubGetAssessments,
  stubGetQuestionGroup,
  stubErrors,
  stubAssessmentQuestions,
  stubPredictors,
  stubRegistrations,
  stubRoshRiskSummary,
  stubDocumentUpload,
  stubCloseAssessment,
}
