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
      jsonBody: {
        assessmentUuid: '7dd4628f-51ed-491b-95c7-7c197ba434b8',
        subject: {
          name: 'Garry Hart',
          dateOfBirth: '1987-03-14',
          pnc: '2012/123450000F',
          crn: 'J081276',
          subjectUuid: '5a8843cf-af3e-4f5d-8137-95462863bc7f',
        },
      },
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
      jsonBody: {
        assessmentUuid: '7dd4628f-51ed-491b-95c7-7c197ba434b8',
        subject: {
          name: 'Garry Hart',
          dateOfBirth: '1987-03-14',
          pnc: '2012/123450000F',
          crn: 'J081276',
          subjectUuid: '5a8843cf-af3e-4f5d-8137-95462863bc7f',
        },
      },
    },
  })
}
module.exports = {
  stubGetAssessmentFromDelius,
  stubPostAssessmentFromDelius,
}
