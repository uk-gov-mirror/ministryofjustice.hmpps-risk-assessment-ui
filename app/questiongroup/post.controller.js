const { logger } = require('../../common/logging/logger')
const { postAnswers } = require('../../common/data/assessmentApi')

const devAssessmentId = 'e69a61ff-7395-4a12-b434-b1aa6478aded'
const episodeId = '4511a3f6-7f51-4b96-b603-4e75eac0c839'

const saveQuestionGroup = async ({ params: { groupId, subgroup }, body, tokens }, res) => {
  try {
    const answers = extractAnswers(body)

    await postAnswers(devAssessmentId, episodeId, answers, tokens)

    const subIndex = Number.parseInt(subgroup, 10)
    return res.redirect(`/questionGroup/${groupId}/${subIndex + 1}`)
  } catch (error) {
    logger.error(`Could not save to assessment ${devAssessmentId}, episode ${episodeId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}

function extractAnswers(body) {
  const shapedAnswers = Object.entries(body).reduce((answers, [key, value]) => {
    const trimmedKey = key.replace(/^id-/, '')

    const answerValue = { freeTextAnswer: value, answers: {} }

    return Object.assign(answers, { [trimmedKey]: answerValue })
  }, {})

  return { answers: shapedAnswers }
}

module.exports = { saveQuestionGroup }
