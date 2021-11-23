const async = require('async')
const { getNamespace } = require('cls-hooked')
const { format, differenceInYears } = require('date-fns')
const { logger } = require('../logging/logger')
const { clsNamespace } = require('../config')

const getYearMonthFromDate = dateString => {
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const monthName = date.toLocaleString('default', { month: 'long' })
  return { month, monthName, year: date.getFullYear().toString() }
}

const isEmptyObject = obj => {
  if (obj === undefined || obj === null) return true
  return !Object.keys(obj).length
}

const countWords = str => {
  return str
    .replace(/-/gi, ' ')
    .trim()
    .split(/\s+/).length
}

const removeUrlLevels = (url, levels) => {
  return !levels || !url
    ? url
    : url
        .split('/')
        .slice(0, -levels)
        .join('/')
}

const sortObject = (key, order = 'asc') => {
  return function innerSort(a, b) {
    // eslint-disable-next-line no-prototype-builtins
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0
    }

    const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key]
    const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key]

    let comparison = 0
    if (varA > varB) {
      comparison = 1
    } else if (varA < varB) {
      comparison = -1
    }
    return order === 'desc' ? comparison * -1 : comparison
  }
}

const groupBy = (list, keyGetter) => {
  const sortedObject = {}
  list.forEach(item => {
    const key = keyGetter(item)
    const collection = sortedObject[key]
    if (!collection) {
      sortedObject[key] = [item]
    } else {
      collection.push(item)
    }
  })
  return sortedObject
}

const catchAndReThrowError = (msg, error) => {
  const newError = new Error(`${msg} ${error}`)
  logger.error(newError)
  throw newError
}

const isValidDate = (day, month, year) => {
  try {
    const date = new Date()
    date.setFullYear(year, month - 1, day)

    return (
      date.getFullYear() === parseInt(year, 10) &&
      date.getMonth() === parseInt(month, 10) - 1 &&
      date.getDate() === parseInt(day, 10)
    )
  } catch (error) {
    logger.error(`Valid date check error for day:${day}, month:${month}, year:${year}, error: ${error}`)
    return false
  }
}

const getCorrelationId = () => getNamespace(clsNamespace).get('MDC').correlationId || ''

const updateMDC = (mdcDataKey, mdc) => getNamespace(clsNamespace).set(mdcDataKey, mdc)

const encodeHTML = str => {
  if (!str) {
    return ''
  }
  return str
    .replace(/>/g, '&gt;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// used in nunjucks templates which doesn't support directly setting json values
const updateJsonValue = (jsonObj, key, value) => {
  if (!jsonObj) {
    return {}
  }
  // eslint-disable-next-line no-param-reassign
  jsonObj[key] = value
  return jsonObj
}

// extract link target from question type formatted as:
// presentation: link("/update-assessment")
const extractLink = questionType => {
  const regex = /^(?:presentation: link|^presentation: buttonlink)\("(?<link>.*)"\)/gm
  const re = regex.exec(questionType)
  if (!re) return null
  const {
    groups: { link },
  } = re
  return link
}

const doReplace = (input, target, replacement) => {
  return input.split(target).join(replacement)
}

// This function executes middleware in series
const dynamicMiddleware = async (validators, req, res, next) => {
  async.eachSeries(
    validators,
    (middleware, doneMiddleware) => {
      middleware.bind(null, req, res, doneMiddleware)()
    },
    error => {
      if (error) {
        logger.error('Problem executing dynamic middleware')
        throw error
      }
      return next(error)
    },
  )
}

const processReplacements = (input, replacementDetails) => {
  let newInput = JSON.stringify(input)

  // replace name
  if (replacementDetails?.name) {
    newInput = newInput.split('[Name of person]').join(replacementDetails.name)
  }

  return JSON.parse(newInput)
}

const prettyDate = s => s && format(new Date(s), 'do MMMM y')
const ageFrom = (dateOfBirth, today = new Date()) => dateOfBirth && differenceInYears(new Date(dateOfBirth), today)

module.exports = {
  getYearMonthFromDate,
  isEmptyObject,
  countWords,
  removeUrlLevels,
  sortObject,
  groupBy,
  isValidDate,
  catchAndReThrowError,
  getCorrelationId,
  updateMDC,
  encodeHTML,
  dynamicMiddleware,
  processReplacements,
  extractLink,
  doReplace,
  updateJsonValue,
  prettyDate,
  ageFrom,
}
