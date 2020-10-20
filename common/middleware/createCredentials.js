// makes a credentials object in req which we eventually use in our API calls
const { getJwtToken } = require('../data/oauth')

module.exports = async (req, res, next) => {
  let {
    headers: { 'x-auth-token': authorisationToken = '' },
  } = req

  if (authorisationToken === '') {
    const { access_token: accessToken } = await getJwtToken()
    authorisationToken = accessToken
  }

  req.tokens = {
    authorisationToken,
  }
  next()
}
