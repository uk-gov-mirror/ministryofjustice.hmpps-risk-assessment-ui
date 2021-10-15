const BaseSaveAndContinue = require('../../common/controllers/saveAndContinue')

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

const invalidateDeclarations = removeAnswers(['declaration'])

class SaveAndContinue extends BaseSaveAndContinue {
  saveValues(req, res, next) {
    const answers = req.sessionModel.get('answers') || {}
    const answersWithInvalidatedDeclarations = invalidateDeclarations(answers)
    req.sessionModel.set('answers', answersWithInvalidatedDeclarations)

    super.saveValues(req, res, next)
  }
}

module.exports = SaveAndContinue
