// const { logger } = require('../../common/logging/logger')
const { assessmentSupervision } = require('../../common/data/hmppsAssessmentApi')

const startPsrFromCourt = ({ params: { courtCode, caseNumber }, user }, res) => {
  return startPsr(courtCode, caseNumber, user?.token, user?.id, res)
}

const startPsrFromForm = ({ body, user }, res) => {
  const { courtCode, caseNumber } = body

  return startPsr(courtCode, caseNumber, user?.token, user?.id, res)
}

const startPsr = async (courtCode, caseNumber, authorisationToken, userId, res) => {
  try {
    // eslint-disable-next-line no-unused-vars
    const [ok, assessment] = await assessmentSupervision({ courtCode, caseNumber }, authorisationToken, userId)

    return res.redirect(`/${assessment.assessmentUuid}/questionGroup/pre_sentence_assessment/summary`)
  } catch (error) {
    return res.render('app/error', { error })
  }
}

module.exports = {
  startPsrFromCourt,
  startPsrFromForm,
}
