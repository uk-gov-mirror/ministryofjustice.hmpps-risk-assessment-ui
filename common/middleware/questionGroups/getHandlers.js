// @ts-check
const nunjucks = require('nunjucks')
const { getAnswers } = require('../../data/hmppsAssessmentApi')
const { logger } = require('../../logging/logger')

const whereAnswerValueIs = value => answerDto => answerDto.value === value
const isMultipleChoiceAnswerFor = answerType => answerType === 'radio' || answerType === 'checkbox'
const isPresentationOnlyFor = answerType => typeof answerType === 'string' && answerType.match(/presentation:/gi)
let conditionalQuestionsToRemove = []
const outOfLineConditionalQuestions = []

const transformTableEntries = tableEntries => {
  const numberOfEntries = tableEntries.length
  const initialiseColumnAnswers = n => Array(n).fill('')

  return tableEntries.reduce((previousAnswers, tableEntry, tableEntryPosition) => {
    const currentAnswers = { ...previousAnswers }
    Object.entries(tableEntry).forEach(([name, value]) => {
      if (!Array.isArray(currentAnswers[name])) {
        currentAnswers[name] = initialiseColumnAnswers(numberOfEntries)
      }
      currentAnswers[name][tableEntryPosition] = value
    })
    return currentAnswers
  }, {})
}

const annotateWithAnswers = (questions, answers, body = {}, tables = {}) => {
  return questions.map(questionSchema => {
    if (questionSchema.type === 'group') {
      return {
        ...questionSchema,
        contents: annotateWithAnswers(questionSchema.contents, answers, body),
      }
    }

    if (isPresentationOnlyFor(questionSchema.answerType)) {
      return {
        ...questionSchema,
        answer: '',
      }
    }

    if (questionSchema.type === 'table' || questionSchema.type === 'tableGroup') {
      const tableEntries = tables[questionSchema.tableCode] || []
      const tableAnswers = transformTableEntries(tableEntries)

      return {
        ...questionSchema,
        contents: questionSchema.contents.map(tableQuestion => {
          if (isPresentationOnlyFor(tableQuestion.answerType)) {
            return tableQuestion
          }
          if (isMultipleChoiceAnswerFor(tableQuestion.answerType)) {
            return {
              ...tableQuestion,
              answerDtos: annotateAnswers(tableQuestion.answerDtos, tableAnswers[tableQuestion.questionCode] || []),
            }
          }
          return {
            ...tableQuestion,
            answer: tableAnswers[tableQuestion.questionCode] || '',
          }
        }),
      }
    }

    if (questionSchema.answerType === 'checkboxGroup') {
      const extractedAnswers = questionSchema.answerDtos.reduce((acc, answerDto) => {
        const answerInBody = body[`${answerDto.value}`]
        const storedAnswer = answers[`${answerDto.value}`]
        const answer = answerInBody || storedAnswer

        if (!answer || !answer.includes('YES')) {
          return acc
        }

        return [...acc, answerDto.value]
      }, [])

      return {
        ...questionSchema,
        answerDtos: annotateAnswers(questionSchema.answerDtos, extractedAnswers),
      }
    }

    const asArray = v => {
      if (!v) {
        return []
      }

      return Array.isArray(v) ? v : [v]
    }

    let answerValues
    const answerInBody = body[questionSchema.questionCode]
    const storedAnswer = answers[questionSchema.questionCode]
    const preferredAnswer = answerInBody || storedAnswer
    const answer = asArray(preferredAnswer)

    if (isMultipleChoiceAnswerFor(questionSchema.answerType)) {
      const answerText = []
      answerValues = []
      answer?.forEach(ans => {
        if (Array.isArray(ans)) {
          const thisElementAnswer = []
          ans.forEach(arrayAns => {
            const thisAnswer = questionSchema.answerDtos.find(whereAnswerValueIs(arrayAns))
            thisElementAnswer.push(thisAnswer.text)
          })
          answerValues.push(thisElementAnswer)
          answerText.push(thisElementAnswer)
        } else {
          const thisAnswer = questionSchema.answerDtos.find(whereAnswerValueIs(ans))
          answerValues.push(thisAnswer?.value)
          answerText.push(thisAnswer?.text)
        }
      })

      return {
        ...questionSchema,
        answerDtos: annotateAnswers(questionSchema.answerDtos, answerInBody || answerValues),
      }
    }

    const [firstAnswer = ''] = answer

    return {
      ...questionSchema,
      answer: firstAnswer,
    }
  })
}

const compileInlineConditionalQuestions = (questions, errors) => {
  // construct an object with all conditional questions, keyed on id
  const conditionalQuestions = {}
  questions.forEach(question => {
    if (question.conditional) {
      const key = question.questionCode
      conditionalQuestions[key] = question
    }
  })

  // add in rendered conditional question strings to each answer when displayed inline
  const compiledQuestions = questions.map(question => {
    if (!isMultipleChoiceAnswerFor(question.answerType)) {
      return question
    }

    if (question.type === 'group') {
      // eslint-disable-next-line no-param-reassign
      question.contents = compileInlineConditionalQuestions(question.contents, errors)
      return question
    }
    let currentQuestion = question

    const { updatedSchemas, removeQuestions } = updateAnswersWithInlineConditionals({
      answerDtos: question.answerDtos,
      conditionalQuestionsToRemove,
      questions,
      errors,
      conditionalQuestions,
    })

    currentQuestion.answerDtos = updatedSchemas

    if (removeQuestions.length) {
      // @ts-ignore
      conditionalQuestionsToRemove = [...new Set(conditionalQuestionsToRemove.concat(removeQuestions))]
    }

    // add appropriate classes to hide questions to be displayed out-of-line
    currentQuestion = updateOutOfLineConditionals(question)
    return currentQuestion
  })

  return compiledQuestions
    .filter(question => {
      // remove questions that have been rendered inline
      return (
        !conditionalQuestionsToRemove.includes(question.questionCode) ||
        outOfLineConditionalQuestions.includes(question.questionCode)
      )
    })
    .map(question => {
      // add css to hide questions to be displayed out of line
      const questionObject = question
      if (!questionObject.questionText) {
        questionObject.formClasses = 'govuk-input--pack-together'
      }
      if (questionObject.conditional) {
        questionObject.formClasses =
          'govuk-radios__conditional govuk-radios__conditional--no-indent govuk-radios__conditional--hidden'
        questionObject.isConditional = true
        questionObject.attributes = [
          ['data-outofline', 'true'],
          ['data-base-question-code', questionObject.questionCode],
        ]
      }
      return questionObject
    })
}

// for inline conditional questions, compile their HTML and add to parent question answer schema,
// then mark the original question for deletion
const updateAnswersWithInlineConditionals = ({
  answerDtos,
  conditionalQuestionsToRemove: questionsToRemove = [],
  questions,
  errors,
  conditionalQuestions,
}) => {
  let removeQuestions = questionsToRemove
  const updatedSchemas = answerDtos?.map(schemaLine => {
    const updatedSchemaLine = schemaLine

    schemaLine.conditionals?.forEach(conditionalDisplay => {
      const subjectCode = conditionalDisplay.conditional
      if (conditionalDisplay.displayInline) {
        let thisError

        const errorString =
          errors[`${conditionalQuestions[subjectCode].questionCode}`]?.text ||
          errors[`${conditionalQuestions[subjectCode].questionCode}`]?.message

        if (errorString) {
          thisError = `{text:'${errorString}'}`
        }
        let conditionalQuestionString =
          '{% from "./common/templates/components/question/macro.njk" import renderQuestion %} \n'

        const conditionalQuestion = conditionalQuestions[subjectCode]

        // do a recursive call to compile inline conditionals for this target question if needed
        const { updatedSchemas: newSchemas, removeQuestions: newRemove } = updateAnswersWithInlineConditionals({
          answerDtos: conditionalQuestion.answerDtos,
          conditionalQuestionsToRemove: removeQuestions,
          questions,
          errors,
          conditionalQuestions,
        })
        conditionalQuestion.answerDtos = newSchemas
        if (newRemove.length) {
          // @ts-ignore
          removeQuestions = [...new Set(removeQuestions.concat(removeQuestions))]
        }

        const questionString = JSON.stringify({
          ...(conditionalQuestion || {}),
          attributes: '',
        })

        conditionalQuestionString += `{{ renderQuestion(${questionString},'','',${thisError}) }}`

        // this replace seems superfluous but avoids triggering a bug in the nunjucks rendering engine:
        // '(unknown path) [Line 2, Column 668] parseAggregate: expected comma after expression'
        // that space is important!
        conditionalQuestionString = conditionalQuestionString.replace(
          '</div></div></fieldset>\\n</div>"}},',
          '</div></div></fieldset>\\n</div>"} },',
        )

        const newHTML = nunjucks.renderString(conditionalQuestionString).replace(/(\r\n|\n|\r)\s+/gm, '')
        let existingHTML = updatedSchemaLine.conditional?.html || ''
        existingHTML += newHTML.replace(/(\r\n|\n|\r)\s+/gm, '')

        updatedSchemaLine.conditional = { html: existingHTML }

        // mark the target question to be deleted later
        removeQuestions.push(subjectCode)
      }
      return updatedSchemaLine
    })
    return schemaLine
  })

  return { updatedSchemas, removeQuestions }
}

const updateOutOfLineConditionals = (question = []) => {
  const currentQuestion = question
  // @ts-ignore
  currentQuestion.answerDtos = currentQuestion.answerDtos?.map(schemaLine => {
    const updatedSchemaLine = schemaLine
    const outOfLineConditionalsForThisAnswer = []

    schemaLine.conditionals?.forEach(conditionalDisplay => {
      const subjectCode = conditionalDisplay.conditional
      if (!conditionalDisplay.displayInline) {
        outOfLineConditionalsForThisAnswer.push(subjectCode)
      }

      if (outOfLineConditionalsForThisAnswer?.length) {
        const pre = 'conditional-id-form-'
        const ariaControls = outOfLineConditionalsForThisAnswer.map(i => pre + i).join(' ')
        updatedSchemaLine.attributes = [
          ['data-conditional', outOfLineConditionalsForThisAnswer.join(' ')],
          ['data-aria-controls', ariaControls],
          ['aria-expanded', `false`],
        ]
        // @ts-ignore
        currentQuestion.isConditional = true
        // @ts-ignore
        currentQuestion.attributes = [['data-contains-conditional', 'true']]
      }
      return updatedSchemaLine
    })
    return schemaLine
  })
  return currentQuestion
}

const annotateAnswers = (answerDtos, answerValue) => {
  if (!answerValue || answerValue?.length === 0) {
    return answerDtos
  }
  return answerDtos.map(as => {
    return Object.assign(as, {
      checked: as.value === answerValue || answerValue.includes(as.value),
      selected: as.value === answerValue || answerValue.includes(as.value),
    })
  })
}

const grabAnswers = (assessmentId, episodeId, token, userId) => {
  try {
    return getAnswers(assessmentId, episodeId, token, userId)
  } catch (error) {
    logger.error(`Could not retrieve answers for assessment ${assessmentId} episode ${episodeId}, error: ${error}`)
    throw error
  }
}

module.exports = { compileInlineConditionalQuestions, annotateWithAnswers, grabAnswers, transformTableEntries }
