// @ts-check
const {
  annotateWithAnswers,
  compileInlineConditionalQuestions,
  grabAnswers,
} = require('../../common/question-groups/get-question-groups')

const displayQuestionGroup = async (
  { params: { assessmentId, groupId, subgroup }, body, errors = {}, errorSummary = null, user },
  res,
) => {
  try {
    const { questionGroup } = res.locals
    const subIndex = Number.parseInt(subgroup, 10)

    const { answers, episodeUuid } = await grabAnswers(assessmentId, 'current', user?.token, user?.id)

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

module.exports = { displayQuestionGroup }
