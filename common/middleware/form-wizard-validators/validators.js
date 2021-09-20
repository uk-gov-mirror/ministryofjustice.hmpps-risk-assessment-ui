const { isDate, isFuture, parseISO, isAfter, intervalToDuration } = require('date-fns')

const range = function range(value, lowerBound, higherBound) {
  return value >= lowerBound && value <= higherBound
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

module.exports = { range, notInFuture, validDate, dateIsAfter, yearsBetweenGreaterThan, yearsBetweenLessThan }
