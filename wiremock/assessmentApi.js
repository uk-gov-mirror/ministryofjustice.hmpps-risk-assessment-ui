const { stubFor } = require('./wiremock')
const questionGroups = require('./responses/questionGroups.json')
const questionAnswers = require('./responses/questionAnswers.json')
const questionList = require('./responses/questionList.json')

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
const stubQuestions = async () => {
  await stubQuestionGroup(1234)
}
const stubAnswers = async () => {
  await stubAnswersGroup(1234)
}
const stubForms = async () => {
  await stubQuestionsList()
}

module.exports = {
  stubForms,
  stubQuestions,
  stubAnswers,
}
