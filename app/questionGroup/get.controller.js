// @ts-check
const { logger } = require('../../common/logging/logger')
const { getAnswers } = require('../../common/data/hmppsAssessmentApi')
const {
  annotateWithAnswers,
  compileInlineConditionalQuestions,
} = require('../../common/question-groups/get-question-groups')

const displayQuestionGroup = async (
  { params: { assessmentId, groupId, subgroup }, body, errors = {}, errorSummary = null, user },
  res,
) => {
  try {
    const { questionGroup } = res.locals
    const subIndex = Number.parseInt(subgroup, 10)

    const { answers, episodeUuid } = await grabAnswers(assessmentId, 'current', user?.token)

    res.locals.assessmentUuid = assessmentId
    res.locals.episodeUuid = episodeUuid

    let questions = annotateWithAnswers(questionGroup.contents, answers, body)
    questions = compileInlineConditionalQuestions(questions, errors)

    return res.render(`${__dirname}/index`, {
      bodyAnswers: { ...body },
      assessmentId,
      heading: questionGroup.title,
      subheading: questionGroup.contents[subIndex]?.title,
      groupId,
      questions,
      errors,
      errorSummary,
    })
  } catch (error) {
    return res.render('app/error', { error })
  }
}

const grabAnswers = (assessmentId, episodeId, token) => {
  try {
    return getAnswers(assessmentId, episodeId, token)
  } catch (error) {
    logger.error(`Could not retrieve answers for assessment ${assessmentId} episode ${episodeId}, error: ${error}`)
    throw error
  }
}

module.exports = { displayQuestionGroup }
