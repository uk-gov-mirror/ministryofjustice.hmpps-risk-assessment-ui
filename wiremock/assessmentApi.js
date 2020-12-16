const { stubFor } = require('./wiremock')
const questionGroups = require('./responses/questionGroups.json')
const questionAnswers = require('./responses/questionAnswers.json')
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
}
