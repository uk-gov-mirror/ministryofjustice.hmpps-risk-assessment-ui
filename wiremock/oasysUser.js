const { stubFor } = require('./wiremock')

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

const stubOasysUser = async () => {
  await stubUserByEmail()
}

module.exports = {
  stubOasysUser,
}
