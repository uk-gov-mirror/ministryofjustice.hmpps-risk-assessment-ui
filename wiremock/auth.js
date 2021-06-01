const jwt = require('jsonwebtoken')
const { getMatchingRequests, stubFor, getFor } = require('./wiremock')

const createToken = () =>
  jwt.sign(
    {
      user_name: 'TEST_USER',
      scope: ['read', 'write'],
      auth_source: 'delius',
      authorities: [],
      jti: 'c5aeef01-2ce0-4122-a199-4dae43db1c96',
      client_id: 'dev',
    },
    'superSecret',
    { expiresIn: '1hr' },
  )

const getLoginUrl = () =>
  getMatchingRequests({
    method: 'GET',
    urlPath: '/auth/oauth/authorize',
  }).then(data => {
    const { requests } = data.body
    const stateValue = requests[requests.length - 1].queryParams.state.values[0]
    return `/login/callback?code=codexxxx&state=${stateValue}`
  })

const redirect = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/auth/oauth/authorize\\?response_type=code&redirect_uri=.+?&state=.+?&client_id=.+?',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        Location: 'http://localhost:3008/login/callback?code=codexxxx&state=stateyyyy',
      },
      body: '<html><body>Login page<h1>Signing in...</h1></body></html>',
    },
  })

const logout = () =>
  stubFor({
    request: {
      method: 'GET',
      urlPath: '/auth/logout',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: '<html><body>Login page<h1>Sign in</h1></body></html>',
    },
  })

const token = () =>
  stubFor({
    request: {
      method: 'POST',
      url: '/auth/oauth/token',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Location: 'http://localhost:3008/login/callback?code=codexxxx&state=stateyyyy',
      },
      jsonBody: {
        access_token: createToken(),
        token_type: 'bearer',
        refresh_token: 'refresh',
        user_name: 'TEST_USER',
        expires_in: 3600,
        scope: 'read write',
        internalUser: true,
      },
    },
  })

const stubUser = username => {
  const user = username || 'TEST_USER'
  return stubFor({
    request: {
      method: 'GET',
      url: `/auth/api/user/${encodeURI(user)}`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        user_name: user,
        staffId: 231232,
        username: user,
        active: true,
        name: `${user} name`,
        authSource: 'delius',
      },
    },
  })
}

const stubUserMe = (username = 'TEST_USER', staffId = 12345, name = 'Ray Arnold') =>
  getFor({
    urlPath: '/auth/api/user/me',
    body: {
      firstName: 'Ray',
      lastName: 'Arnold',
      name,
      username,
      staffId,
    },
  })

const stubUserMeRoles = (roles = ['ROLE']) =>
  stubFor({
    request: {
      method: 'GET',
      url: '/auth/api/user/me/roles',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: roles,
    },
  })

const stubEmail = username =>
  stubFor({
    request: {
      method: 'GET',
      url: `/auth/api/me/email`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        email: `${username}@gov.uk`,
      },
    },
  })

const stubAuth = () =>
  Promise.all([redirect(), logout(), token(), stubUser(), stubUserMe(), stubUserMeRoles(), stubEmail()])

module.exports = {
  getLoginUrl,
  stubAuth,
}
