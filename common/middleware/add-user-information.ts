// adds relevant user information to res.locals for use by nunjucks templates

export default (req, res, next) => {
  res.locals.username = req.user?.username
  res.locals.userFullName = req.user?.name
  next()
}
