const { logger } = require('../../common/logging/logger')
const { getQuestionList } = require('../../common/data/assessmentApi')

const displayQuestionList = async ({ tokens }, res) => {
  try {
    const questionsList = await getQuestionList(tokens)

    const topLevelForms = questionsList
      .filter(form => form.questionCount === 0)
      .map(form => {
        return {
          ...form,
          path: `/questionGroup/${form.groupId}/0`,
        }
      })

    topLevelForms.sort((l, r) => {
      const lTitle = l.title.toUpperCase()
      const rTitle = r.title.toUpperCase()

      if (lTitle < rTitle) return -1
      if (lTitle > rTitle) return 1
      return 0
    })

    return res.render(`${__dirname}/index`, {
      forms: topLevelForms,
    })
  } catch (error) {
    logger.error(`Could not retrieve questions list, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { displayQuestionList }
