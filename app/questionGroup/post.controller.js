/* eslint-disable no-param-reassign */

const { logger } = require('../../common/logging/logger')
const { displayQuestionGroup } = require('./get.controller')
const { postAnswers } = require('../../common/data/hmppsAssessmentApi')
const { formatValidationErrors, extractAnswers } = require('../../common/question-groups/post-question-groups')

const saveQuestionGroup = async (req, res) => {
  const {
    params: { assessmentId },
    body: reqBody,
    user,
    errors,
  } = req
  if (errors) {
    return displayQuestionGroup(req, res)
  }

  try {
    const answers = extractAnswers(reqBody)
    const [ok, episode] = await postAnswers(assessmentId, 'current', answers, user?.token, user?.id)

    if (!ok) {
      const [validationErrors, errorSummary] = formatValidationErrors(episode.errors, episode.pageErrors)
      req.errors = validationErrors
      req.errorSummary = errorSummary
      return displayQuestionGroup(req, res)
    }

    return res.redirect(`/${assessmentId}/questiongroup/${res.locals.navigation.next.url}`)
  } catch (error) {
    logger.error(`Could not save to assessment ${assessmentId}, current episode, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { saveQuestionGroup }
