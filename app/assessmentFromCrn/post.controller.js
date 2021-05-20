// const { logger } = require('../../common/logging/logger')
const { assessmentSupervision } = require('../../common/data/hmppsAssessmentApi')

const startAssessmentFromCrn = ({ params: { crn, deliusEventId, assessmentType }, user }, res) => {
  return startAssessment(crn, deliusEventId, assessmentType, user?.token, res)
}

const startAssessmentFromForm = ({ body, user }, res) => {
  const { crn, deliusEventId, assessmentType } = body
  return startAssessment(crn, deliusEventId, assessmentType, user?.token, res)
}

const startAssessment = async (crn, deliusEventId, assessmentType, authorisationToken, res) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const [ok, assessment] = await assessmentSupervision({ crn, deliusEventId, assessmentType }, authorisationToken)
    return res.redirect(`/${assessment.assessmentUuid}/questionGroup/pre_sentence_assessment/summary`)
  } catch (error) {
    return res.render('app/error', { error })
  }
}

module.exports = {
  startAssessmentFromCrn,
  startAssessmentFromForm,
}
