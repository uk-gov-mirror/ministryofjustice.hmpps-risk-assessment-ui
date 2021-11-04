const BaseSaveAndContinue = require('../../common/controllers/saveAndContinue')
const { getRegistrations } = require('./common.utils')

const removeAnswers = fieldsToRemove => answers =>
  Object.entries(answers).reduce((modifiedAnswers, [fieldName, answer]) => {
    if (fieldsToRemove.includes(fieldName)) {
      return {
        ...modifiedAnswers,
        [fieldName]: '',
      }
    }

    return {
      ...modifiedAnswers,
      [fieldName]: answer,
    }
  }, {})

const setDefaultSectionCompleteAnswers = (answers, fields) => {
  const newAnswers = answers
  fields.forEach(field => {
    if (!newAnswers[field] || newAnswers[field] === '') {
      newAnswers[field] = 'NO_ILL_COME_BACK_LATER'
    }
  })

  return newAnswers
}

const invalidateSectionCompleteAnswers = (answers, fields) => {
  return Object.entries(answers)
    .map(([key, value]) => (fields.includes(key) ? [key, ''] : [key, value]))
    .reduce((a, [key, value]) => ({ ...a, [key]: value }), {})
}

const invalidateDeclarations = removeAnswers(['declaration'])

class SaveAndContinue extends BaseSaveAndContinue {
  async locals(req, res, next) {
    res.locals.widgetData = await getRegistrations(res.locals.assessment?.subject?.crn, req.user)

    super.locals(req, res, next)

    let answers = req.sessionModel.get('answers') || {}

    const validationErrors = Object.keys(req.form.errors)
    const sectionCompleteFields = Object.keys(req.form?.options?.fields).filter(key => key.match(/^\w+_complete$/))

    if (validationErrors.length > 0) {
      answers = invalidateSectionCompleteAnswers(answers, sectionCompleteFields)
    }

    answers = setDefaultSectionCompleteAnswers(answers, sectionCompleteFields)
    req.sessionModel.set('answers', answers)
  }

  saveValues(req, res, next) {
    const answers = req.sessionModel.get('answers') || {}
    const answersWithInvalidatedDeclarations = invalidateDeclarations(answers)
    req.sessionModel.set('answers', answersWithInvalidatedDeclarations)

    super.saveValues(req, res, next)
  }
}

module.exports = SaveAndContinue
