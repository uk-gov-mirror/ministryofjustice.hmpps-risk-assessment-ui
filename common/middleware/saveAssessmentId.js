module.exports = async (req, res, next) => {
  if (!res.locals.assessmentId) {
    res.locals.assessmentId = req.params.assessmentId
  }
  if (!res.locals.body) {
    res.locals.body = req.body
  }

  return next()
}
