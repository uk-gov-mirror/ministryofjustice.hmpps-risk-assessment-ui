const { logger } = require('../../common/logging/logger')
const { getAssessmentsList } = require('../../common/data/assessmentApi')
const { sortObject } = require('../../common/utils/util')

const displayAssessmentsList = async ({ params: { assessmentId }, tokens }, res) => {
  try {
    const questionsList = await getAssessmentsList(tokens)

    const topLevelForms = questionsList
      .filter(form => form.questionCount === 0)
      .map(form => {
        return {
          ...form,
          path: `/${assessmentId}/questionGroup/${form.groupId}/summary`,
        }
      })

    topLevelForms.sort(sortObject('title'))

    return res.render(`${__dirname}/index`, {
      forms: topLevelForms,
    })
  } catch (error) {
    logger.error(`Could not retrieve questions list, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { displayAssessmentsList }
