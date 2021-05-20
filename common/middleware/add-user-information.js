// adds relevant user information to res.locals for use by nunjucks templates

module.exports = (req, res, next) => {
  res.locals.username = req.user?.username
  next()
}
