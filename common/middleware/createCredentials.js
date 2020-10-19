// makes a credentials object in req which we eventually use in our API calls
const { getJwtToken } = require('../data/oauth')

module.exports = async (req, res, next) => {
  let {
    headers: { 'x-auth-token': authorisationToken = '' },
  } = req

  if (authorisationToken === '') {
    authorisationToken = await getJwtToken()
  }

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(authorisationToken, null, 2))

  req.tokens = {
    authorisationToken,
  }
  next()
}
