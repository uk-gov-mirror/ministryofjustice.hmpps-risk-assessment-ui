const { stubFor } = require('./wiremock')
const userProfile = require('./responses/userProfile.json')
const userProfileWithOneArea = require('./responses/userProfileWithOneArea.json')

const stubUserByEmail = () => {
  stubFor({
    request: {
      method: 'POST',
      urlPattern: `/authentication/user/email`,
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 200,
      body: JSON.stringify({
        oasysUserCode: 'SUPPORT1',
        userForename1: 'Ray',
        userFamilyName: 'Arnold',
        email: 'ray.arnold@hmpps.gsi.gov.uk',
        accountStatus: 'ACTIVE',
      }),
    },
  })
}

const stubGetUserProfile = () => {
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/authentication/user/SUPPORT1',
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 200,
      jsonBody: userProfile,
    },
  })
}

const stubGetUserProfileWithSingleArea = () => {
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/authentication/user/SUPPORT1',
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 200,
      jsonBody: userProfileWithOneArea,
    },
  })
}

const stubOasysUser = async () => {
  await stubUserByEmail()
}

module.exports = {
  stubOasysUser,
  stubGetUserProfile,
  stubGetUserProfileWithSingleArea,
}
