// const { logger } = require('../../common/logging/logger')
const { assessmentSupervision } = require('../../common/data/assessmentApi')

const startPsrFromCourt = async ({ body, tokens }, res) => {
  try {
    const { courtCode, caseNumber } = body

    const assessment = await assessmentSupervision({ courtCode, caseNumber }, tokens)

    return res.redirect(`${assessment.assessmentUuid}/questionGroup/pre_sentence_report/0`)
  } catch (error) {
    return res.render('app/error', { error })
  }
}

module.exports = { startPsrFromCourt }
