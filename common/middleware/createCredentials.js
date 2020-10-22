// makes a credentials object in req which we eventually use in our API calls
const { getJwtToken } = require('../data/oauth')

module.exports = async (req, res, next) => {
  if (!req.session.token || req.session.expires < Date.now()) {
    const { access_token: accessToken, expires_in: expires } = await getJwtToken()
    req.session.token = accessToken
    req.session.expires = Date.now() + expires * 1000
  }

  req.tokens = {
    authorisationToken: req.session.token,
  }
  next()
}
