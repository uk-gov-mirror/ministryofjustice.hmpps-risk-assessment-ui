const { stubFor } = require('./wiremock')

const stubStart = () => {
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/start',
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

module.exports = {
  stubStart,
}
