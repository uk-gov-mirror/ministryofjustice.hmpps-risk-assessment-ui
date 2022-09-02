const { STANDALONE_ASSESSMENTS } = require('../utils/constants')

const checkAssessmentType = () => async (req, res, next) => {
  let standaloneAssessment = false
  if (STANDALONE_ASSESSMENTS.includes(req.query.assessmentType)) {
    standaloneAssessment = true
  } else {
    const assessmentType = req.originalUrl?.split('/')[1].toUpperCase()
    if (STANDALONE_ASSESSMENTS.includes(assessmentType)) {
      standaloneAssessment = true
    }
  }

  req.session.standaloneAssessment = standaloneAssessment
  req.session.save()

  return next()
}

module.exports = {
  checkAssessmentType,
}
