const flattenCheckboxGroups = questions => {
  return questions.map(question => {
    if (question.type === 'checkboxGroup') {
      return {
        type: 'question',
        questionId: question.checkboxGroupId,
        questionCode: question.checkboxGroupCode,
        answerType: 'checkboxGroup',
        questionText: question.title,
        displayOrder: question.displayOrder,
        mandatory: question.mandatory || true,
        readOnly: question.readOnly || false,
        conditional: question.conditional || false,
        answerSchemas: question.contents.map(({ questionId, questionText }) => ({
          value: questionId,
          text: questionText,
        })),
      }
    }

    return question
  })
}

const extractCheckboxGroupAnswers = (questions = [], answers = {}) => {
  const checkboxGroups = questions.filter(question => question.type === 'checkboxGroup')

  const extractedAnswers = checkboxGroups.reduce(
    (previousAnswers, checkboxGroup) => {
      const updatedAnswers = { ...previousAnswers }
      const checkboxGroupQuestions = checkboxGroup.contents
      checkboxGroupQuestions.forEach(({ questionId, answerSchemas = [] }) => {
        const answersForThisGroup = updatedAnswers[checkboxGroup.checkboxGroupId] || []
        const [firstAnswer, secondAnswer] = answerSchemas
        if (answersForThisGroup.includes(questionId) && firstAnswer) {
          updatedAnswers[questionId] = [firstAnswer.value]
        } else if (secondAnswer) {
          updatedAnswers[questionId] = [secondAnswer.value]
        }
      })
      return updatedAnswers
    },
    { ...answers },
  )

  // Tidy up the answers and remove the checkBox group wrappers
  checkboxGroups.forEach(({ checkboxGroupId }) => delete extractedAnswers[checkboxGroupId])

  return extractedAnswers
}

module.exports = {
  flattenCheckboxGroups,
  extractCheckboxGroupAnswers,
}
