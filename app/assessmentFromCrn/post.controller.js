// const { logger } = require('../../common/logging/logger')
const { assessmentSupervision } = require('../../common/data/hmppsAssessmentApi')

const startAssessmentFromCrn = ({ params: { crn, deliusEventId, assessmentType }, tokens }, res) => {
  return startAssessment(crn, deliusEventId, assessmentType, tokens, res)
}

const startAssessmentFromForm = ({ body, tokens }, res) => {
  const { crn, deliusEventId, assessmentType } = body
  return startAssessment(crn, deliusEventId, assessmentType, tokens, res)
}

const startAssessment = async (crn, deliusEventId, assessmentType, tokens, res) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const [ok, assessment] = await assessmentSupervision({ crn, deliusEventId, assessmentType }, tokens)
    return res.redirect(`/${assessment.assessmentUuid}/questionGroup/pre_sentence_assessment/summary`)
  } catch (error) {
    return res.render('app/error', { error })
  }
}

module.exports = {
  startAssessmentFromCrn,
  startAssessmentFromForm,
}
