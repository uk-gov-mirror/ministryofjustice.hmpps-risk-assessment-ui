const { body } = require('express-validator')
const { isDate, isFuture, isEqual, parseISO, isAfter, intervalToDuration } = require('date-fns')
const { validationResult } = require('express-validator')
const { removeBlankErrors, formatErrors, formatErrorSummary } = require('../utils/formatErrors')
const { isEmptyObject, dynamicMiddleware } = require('../utils/util')

const getFieldFor = code => {
  const fields = {
    dateFirstSanction: 'date_first_sanction',
    totalSanctions: 'total_sanctions',
    violentOffences: 'total_violent_offences',
    currentConvictionDate: 'date_current_conviction',
    haveTheyCommittedASexualOffence: 'any_sexual_offences',
    dateOfMostRecentSexualOffence: 'most_recent_sexual_offence_date',
    dateOfCommencement: 'earliest_release_date',
    numAdultSexual: 'total_sexual_offences_adult',
    numChildSexual: 'total_sexual_offences_child',
    numIndecentImage: 'total_sexual_offences_child_image',
    numNonContactSexual: 'total_non_sexual_offences',
  }

  if (fields[code]) {
    return fields[code]
  }
  return false
}

// question validation rules hardcoded in the UI, not driven by the Assessments API responses.
// eslint-disable-next-line consistent-return
const localValidationRules = async (req, res, next) => {
  const {
    body: reqBody,
    params: { groupId: assessmentType, page },
  } = req

  const {
    locals: {
      offenderDetails: { dob: offenderDateOfBirth },
    },
  } = res
  const validations = []

  if (assessmentType === 'RSR' && parseInt(page, 10) === 1) {
    /// ///////////////////////////////////////////////////
    // Date of first sanction:
    validations.push(
      body(getFieldFor('dateFirstSanction'))
        .custom(value => {
          return value && isDate(parseISO(value))
        })
        .withMessage({ error: 'Enter a valid date' })
        .bail()
        .custom(value => {
          return !isFuture(parseISO(value))
        })
        .withMessage({ error: 'Date cannot be in the future' })
        .bail()
        .custom(value => {
          return isAfter(parseISO(value), parseISO(offenderDateOfBirth))
        })
        .withMessage({ error: 'Date must be later than the individual’s date of birth' })
        .bail()
        .custom(value => {
          const duration = intervalToDuration({
            start: parseISO(offenderDateOfBirth),
            end: parseISO(value),
          })
          return duration.years >= 8
        })
        .withMessage({ error: 'The individual must be aged 8 or older on the date of first sanction' }),
    )
    /// ///////////////////////////////////////////////////
    // total sanctions:
    validations.push(
      body(getFieldFor('totalSanctions'))
        .isInt({ min: 1, max: 999 })
        .withMessage({ error: 'Enter a number between 1 and 999' }),
    )
    /// ///////////////////////////////////////////////////
    // violent offences:
    const totalSanctions = parseInt(reqBody[getFieldFor('totalSanctions')], 10)
    validations.push(
      body(getFieldFor('violentOffences'))
        .isInt()
        .withMessage({ error: 'Enter the number of violent offences' })
        .bail()
        .isInt({ min: 0, max: totalSanctions })
        .withMessage({ error: 'Cannot be greater than the total number of sanctions for all offences' }),
    )
    /// ///////////////////////////////////////////////////
    // date of current conviction:
    validations.push(
      body(getFieldFor('currentConvictionDate'))
        .custom(value => {
          return value && isDate(parseISO(value))
        })
        .withMessage({ error: 'Enter a valid date' })
        .bail()
        .custom(value => {
          return !isFuture(parseISO(value))
        })
        .withMessage({ error: 'Date cannot be in the future' })
        .bail()
        .custom(value => {
          return isAfter(parseISO(value), parseISO(offenderDateOfBirth))
        })
        .withMessage({ error: 'Date must be later than the individual’s date of birth' }),
    )

    // offender’s age at Date of Current Conviction CANNOT BE LESS than the offender’s age at first conviction
    // i.e. current conviction date cannot be less than first conviction date
    if (reqBody[getFieldFor('dateFirstSanction')] && isDate(parseISO(reqBody[getFieldFor('dateFirstSanction')]))) {
      validations.push(
        body(getFieldFor('currentConvictionDate'))
          .custom(value => {
            return (
              isEqual(parseISO(value), parseISO(reqBody[getFieldFor('dateFirstSanction')])) ||
              isAfter(parseISO(value), parseISO(reqBody[getFieldFor('dateFirstSanction')]))
            )
          })
          .withMessage({ error: 'Current conviction cannot be before the date of first conviction' }),
      )
    }

    /// ///////////////////////////////////////////////////
    // Date of most recent sanction involving a sexual or sexually motivated offence:
    if (reqBody[getFieldFor('haveTheyCommittedASexualOffence')] === 'YES') {
      validations.push(
        body(getFieldFor('dateOfMostRecentSexualOffence'))
          .custom(value => {
            return value && isDate(parseISO(value))
          })
          .withMessage({ error: 'Enter a valid date' })
          .bail()
          .custom(value => {
            return !isFuture(parseISO(value))
          })
          .withMessage({ error: 'Date cannot be in the future' })
          .bail()
          .custom(value => {
            return isAfter(parseISO(value), parseISO(offenderDateOfBirth))
          })
          .withMessage({ error: 'Date must be later than the individual’s date of birth' }),
      )

      validations.push(
        body(getFieldFor('numAdultSexual'))
          .isInt({ min: 0, max: 99 })
          .withMessage({ error: 'Enter a number' }),
      )
      validations.push(
        body(getFieldFor('numChildSexual'))
          .isInt({ min: 0, max: 99 })
          .withMessage({ error: 'Enter a number' }),
      )
      validations.push(
        body(getFieldFor('numIndecentImage'))
          .isInt({ min: 0, max: 99 })
          .withMessage({ error: 'Enter a number' }),
      )
      validations.push(
        body(getFieldFor('numNonContactSexual'))
          .isInt({ min: 0, max: 99 })
          .withMessage({ error: 'Enter a number' }),
      )
    }

    validations.push(
      body(getFieldFor('dateOfCommencement'))
        .custom(value => {
          return value && isDate(parseISO(value))
        })
        .withMessage({ error: 'Enter a valid date' })
        .bail()
        .custom(value => {
          return isAfter(parseISO(value), parseISO(offenderDateOfBirth))
        })
        .withMessage({ error: 'Date must be later than the individual’s date of birth' })
        .bail()
        .custom(value => {
          const duration = intervalToDuration({
            start: parseISO(offenderDateOfBirth),
            end: parseISO(value),
          })
          return duration.years <= 110
        })
        .withMessage({ error: 'PLACEHOLDER: The individual must be aged 110 or younger on commencement' }),
    )

    await dynamicMiddleware(validations, req, res, next)
  } else return next()
}

const validate = (req, res, next) => {
  const { errors } = validationResult(req)

  if (isEmptyObject(errors)) {
    return next()
  }
  const filteredErrors = removeBlankErrors(errors)
  req.errors = formatErrors(filteredErrors)
  req.errorSummary = formatErrorSummary(filteredErrors)

  return next()
}

module.exports = { validate, localValidationRules }
