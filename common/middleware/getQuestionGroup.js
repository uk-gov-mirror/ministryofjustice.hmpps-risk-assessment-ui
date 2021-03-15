const logger = require('../logging/logger')
const { getQuestionGroup } = require('../data/assessmentApi')

module.exports = async ({ params: { groupId }, tokens }, res, next) => {
  try {
    const questions = await getQuestionGroup(groupId, tokens)
    const readOnlyToAttribute = q => {
      if (q.readOnly) {
        // eslint-disable-next-line no-param-reassign
        q.attributes = { readonly: true, disabled: true, ...q.attributes }
      }
      q.contents?.forEach(c => readOnlyToAttribute(c))
    }
    questions.contents?.forEach(q => readOnlyToAttribute(q))
    res.locals.questionGroup = questions
    return next()
  } catch (error) {
    logger.error(`Could not retrieve question group for ${groupId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}
