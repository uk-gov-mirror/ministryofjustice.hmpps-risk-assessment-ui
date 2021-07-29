/* eslint-disable no-param-reassign */
const { logger } = require('../../common/logging/logger')
const { displayQuestionGroup } = require('./get.controller')
const { postAnswers } = require('../../common/data/hmppsAssessmentApi')
const { formatValidationErrors } = require('../../common/middleware/questionGroups/postHandlers')

const getErrorMessage = reason => {
  if (reason === 'OASYS_PERMISSION') {
    return 'You do not have permission to update this type of assessment. Speak to your manager and ask them to request a change to your level of authorisation.'
  }

  return 'Something went wrong'
}

const saveQuestionGroup = async (req, res) => {
  const {
    params: { assessmentId },
    user,
    errors,
    body: answers,
  } = req
  if (errors) {
    return displayQuestionGroup(req, res)
  }

  try {
    const [ok, response] = await postAnswers(assessmentId, 'current', { answers }, user?.token, user?.id)

    if (!ok) {
      if (response.status === 422) {
        const [validationErrors, errorSummary] = formatValidationErrors(response.errors, response.pageErrors)
        req.errors = validationErrors
        req.errorSummary = errorSummary
        return displayQuestionGroup(req, res)
      }
      return res.render('app/error', { subHeading: getErrorMessage(response.reason) })
    }

    return res.redirect(`/${assessmentId}/questiongroup/${res.locals.navigation.next.url}`)
  } catch (error) {
    logger.error(`Could not save to assessment ${assessmentId}, current episode, error: ${error}`)
    return res.render('app/error', { error })
  }
}

module.exports = { saveQuestionGroup }
