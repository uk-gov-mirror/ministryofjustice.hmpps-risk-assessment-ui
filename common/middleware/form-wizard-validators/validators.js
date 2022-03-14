const { isDate, isFuture, parseISO, isAfter, isEqual, intervalToDuration } = require('date-fns')

const onePresent = function range(value, otherValue) {
  const valueCheck = value != null && value.trim().length !== 0
  const otherValueCheck = otherValue != null && otherValue.trim().length !== 0

  return valueCheck || otherValueCheck
}

const range = function range(value, lowerBound, higherBound) {
  return Number(value) >= Number(lowerBound) && Number(value) <= Number(higherBound)
}

const notInFuture = function inFuture(value) {
  return !isFuture(parseISO(value))
}

const validDate = function validDate(date) {
  return date && parseISO(date).toString() !== 'Invalid Date' && isDate(parseISO(date))
}

const dateIsAfter = function dateIsAfter(date1, date2) {
  return isAfter(parseISO(date1), parseISO(date2))
}

const dateIsAfterOrEqual = function dateIsAfterOrEqual(date1, date2) {
  return isAfter(parseISO(date1), parseISO(date2)) || isEqual(parseISO(date1), parseISO(date2))
}

const yearsBetweenGreaterThan = function yearsBetween(date1, date2, years) {
  const duration = intervalToDuration({
    start: parseISO(date2),
    end: parseISO(date1),
  })
  return Math.abs(duration.years) >= years
}

const yearsBetweenLessThan = function yearsBetween(date1, date2, years) {
  const duration = intervalToDuration({
    start: parseISO(date2),
    end: parseISO(date1),
  })
  return Math.abs(duration.years) <= years
}

const noSpace = function noSpace(value) {
  if (value.length === 0) return true
  return value.trim().length > 0
}

module.exports = {
  range,
  notInFuture,
  validDate,
  dateIsAfter,
  dateIsAfterOrEqual,
  yearsBetweenGreaterThan,
  yearsBetweenLessThan,
  noSpace,
  onePresent,
}
