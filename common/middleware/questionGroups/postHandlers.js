const { extractCheckboxGroupAnswers } = require('./checkboxGroups')

function findDateAnswerKeys(postBody) {
  // find keys of all the dates in the body
  const pattern = /-day$/
  return Object.keys(postBody).filter(key => {
    return pattern.test(key)
  })
}

const assembleDates = async (req, res, next) => {
  const { body: reqBody } = req

  const dateKeys = findDateAnswerKeys(reqBody)

  dateKeys.forEach(key => {
    const dateKey = key.replace(/-day$/, '')
    let constructedDate = ''
    try {
      reqBody[`${dateKey}-month`] = reqBody[`${dateKey}-month`].toString().padStart(2, '0')
      reqBody[`${dateKey}-day`] = reqBody[`${dateKey}-day`].toString().padStart(2, '0')

      if (reqBody[`${dateKey}-year`] && reqBody[`${dateKey}-month`] && reqBody[`${dateKey}-day`]) {
        constructedDate = `${reqBody[`${dateKey}-year`]}-${reqBody[`${dateKey}-month`]}-${reqBody[`${dateKey}-day`]}`
      }
    } catch {
      constructedDate = null
    }

    reqBody[dateKey] = constructedDate
    delete reqBody[`${dateKey}-year`]
    delete reqBody[`${dateKey}-month`]
    delete reqBody[`${dateKey}-day`]
  })

  return next()
}

function formatValidationErrors(serverErrors, pageErrors) {
  const errors = {}
  const errorSummary = []
  if (serverErrors) {
    for (let i = 0; i < Object.entries(serverErrors).length; i += 1) {
      const [questionCode, msg] = Object.entries(serverErrors)[i]
      errors[`${questionCode}`] = { text: msg[0] }
      errorSummary.push({
        text: msg[msg.length === 2 ? 1 : 0],
        href: `#${questionCode}-error`,
      })
    }
  }
  if (pageErrors) {
    for (let i = 0; i < pageErrors.length; i += 1) {
      errorSummary.push({
        text: pageErrors[i],
        href: '#',
      })
    }
  }
  return [errors, errorSummary]
}

function extractAnswers(req, res, next) {
  const { body: reqBody } = req
  const { questionGroup } = res.locals
  const currentQuestions = questionGroup.contents

  const shapedAnswers = Object.entries(reqBody).reduce((answers, [key, value]) => {
    return Object.assign(answers, { [key]: value })
  }, {})

  const answers = extractCheckboxGroupAnswers(currentQuestions, shapedAnswers)

  req.body = answers
  next()
}

module.exports = { assembleDates, formatValidationErrors, extractAnswers }
