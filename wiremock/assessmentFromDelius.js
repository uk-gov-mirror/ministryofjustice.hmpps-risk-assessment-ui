const { stubFor } = require('./wiremock')

const stubGetAssessmentFromDelius = () => {
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/assessment-from-delius',
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

const stubPostAssessmentFromDelius = () => {
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/assessment-from-delius',
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 302,
      jsonBody: {},
    },
  })
}
module.exports = {
  stubGetAssessmentFromDelius,
  stubPostAssessmentFromDelius,
}
