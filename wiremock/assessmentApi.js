const { stubFor } = require('./wiremock')
const questionGroups = require('./responses/questionGroups.json')
const questionAnswers = require('./responses/questionAnswers.json')
const questionGroupSummaries = require('./responses/questionGroupSummary.json')
const questionList = require('./responses/questionList.json')
const assessmentEpisodes = require('./responses/assessmentEpisodes.json')
const offenderDetails = require('./responses/offenderDetails.json')
const assessmentSupervision = require('./responses/assessmentSupervision.json')

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

const stubAssessmentSupervision = () => {
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/assessments/supervision',
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
      jsonBody: {},
    },
  })
}

const stubQuestionGroup = groupId => {
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/questions/${groupId}`,
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 200,
      jsonBody: questionGroups[groupId],
    },
  })
}

const stubAllInternalQuestionGroups = groups => {
  if (Array.isArray(groups)) {
    groups.forEach(group => {
      if (group.contents?.type === 'group') {
        stubAllInternalQuestionGroups(group.contents)
      }
    })
  } else {
    stubFor({
      request: {
        method: 'GET',
        urlPattern: `/questions/${groups.groupId}`,
      },
      response: {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        status: 200,
        jsonBody: groups,
      },
    })
    groups.contents?.forEach(subgroup => {
      if (subgroup.type === 'group') {
        // eslint-disable-next-line no-unused-vars
        stubAllInternalQuestionGroups(subgroup)
      }
    })
  }
}

const stubQuestionGroupSummary = groupId => {
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/questions/${groupId}/summary`,
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 200,
      jsonBody: questionGroupSummaries[groupId],
    },
  })
}
const stubAnswersGroup = groupId => {
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
const stubQuestionsList = () => {
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/questions/list`,
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 200,
      jsonBody: questionList,
    },
  })
}
const stubAssessmentEpisodes = () => {
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
      jsonBody: {},
    },
  })
}
const stubQuestions = async () => {
  await stubQuestionGroup('1234')
  await stubQuestionGroup('22222222-2222-2222-2222-222222222203')
  await stubQuestionGroup('22222222-2222-2222-2222-222222222201')
  await stubQuestionGroup('22222222-2222-2222-2222-222222222240')
  await stubQuestionGroup('65a3924c-4130-4140-b7f4-cc39a52603bb') // short psr

  // await stubAllInternalQuestionGroups(questionGroups['65a3924c-4130-4140-b7f4-cc39a52603bb'])
  // await stubAllInternalQuestionGroups(questionGroups['22222222-2222-2222-2222-222222222203'])
}

const stubQuestionSummaries = async () => {
  await stubQuestionGroupSummary('65a3924c-4130-4140-b7f4-cc39a52603bb') // short psr
  await stubQuestionGroupSummary('22222222-2222-2222-2222-222222222203') // brief
}
const stubAnswers = async () => {
  await stubAnswersGroup(1234)
}
const stubForms = async () => {
  await stubQuestionsList()
}
const stubEpisodes = async () => {
  await stubAssessmentEpisodes()
}
const stubSupervision = async () => {
  await stubAssessmentSupervision()
}

module.exports = {
  stubForms,
  stubQuestions,
  stubAnswers,
  stubEpisodes,
  stubSupervision,
  stubOffenderDetails,
  stubQuestionSummaries,
  stubAssessmentComplete,
}
