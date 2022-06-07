const { DateTime, Interval } = require('luxon')

const onePresent = function range(value, otherValue) {
  const valueCheck = value != null && value.trim().length !== 0
  const otherValueCheck = otherValue != null && otherValue.trim().length !== 0

  return valueCheck || otherValueCheck
}

const range = function range(value, lowerBound, higherBound) {
  return Number(value) >= Number(lowerBound) && Number(value) <= Number(higherBound)
}

const notInFuture = function inFuture(isoString) {
  return DateTime.fromISO(isoString) < DateTime.now()
}

const validDate = function validDate(isoString) {
  return isoString && DateTime.fromISO(isoString).isValid
}

const dateIsAfter = function dateIsAfter(isoString1, isoString2) {
  const date1 = DateTime.fromISO(isoString1).startOf('day')
  const date2 = DateTime.fromISO(isoString2).startOf('day')
  return date1 > date2
}

const dateIsAfterOrEqual = function dateIsAfterOrEqual(isoString1, isoString2) {
  const date1 = DateTime.fromISO(isoString1).startOf('day')
  const date2 = DateTime.fromISO(isoString2).startOf('day')
  return date1 >= date2
}

const intervalFrom = (isoString1, isoString2) => {
  const date1 = DateTime.fromISO(isoString1).startOf('day')
  const date2 = DateTime.fromISO(isoString2).startOf('day')
  return date1 < date2 ? Interval.fromDateTimes(date1, date2) : Interval.fromDateTimes(date2, date1)
}

const yearsBetweenGreaterThan = function yearsBetween(isoString1, isoString2, years) {
  const diff = intervalFrom(isoString1, isoString2)
  return diff.length('years') > years
}

const yearsBetweenLessThan = function yearsBetween(isoString1, isoString2, years) {
  const diff = intervalFrom(isoString1, isoString2)
  return diff.length('years') < years
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
