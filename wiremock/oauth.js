const { stubFor } = require('./wiremock')
const jwtToken = require('../common/middleware/testSupportFiles/mock_jwt_token.json')

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
      body: JSON.stringify(jwtToken),
    },
  })
}

const stubGetToken = async () => {
  await stubOauth()
}

module.exports = {
  stubGetToken,
}
