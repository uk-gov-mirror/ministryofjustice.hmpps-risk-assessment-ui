const { stubFor } = require('./wiremock')

const stubOauth = () => {
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/oauth/token\\?grant_type=client_credentials`,
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 200,
      body: '{ token: "mocked token" }',
    },
  })
}

const stubGetToken = async () => {
  await stubOauth()
}

module.exports = {
  stubGetToken,
}
