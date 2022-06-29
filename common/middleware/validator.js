const { body } = require('express-validator')
const { validationResult } = require('express-validator')
const { DateTime, Interval } = require('luxon')
const { removeBlankErrors, formatErrors, formatErrorSummary } = require('../utils/formatErrors')
const { isEmptyObject, dynamicMiddleware } = require('../utils/util')

const getFieldFor = (code) => {
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
    numNonContactSexual: 'total_non_contact_sexual_offences',
  }

  if (fields[code]) {
    return fields[code]
  }
  return false
}

const intervalFrom = (isoString1, isoString2) => {
  const date1 = DateTime.fromISO(isoString1).startOf('day')
  const date2 = DateTime.fromISO(isoString2).startOf('day')
  return date1 < date2 ? Interval.fromDateTimes(date1, date2) : Interval.fromDateTimes(date2, date1)
}

const isValidDate = (isoString) => DateTime.fromISO(isoString).isValid
const isPastDate = (isoString) => DateTime.fromISO(isoString) < DateTime.now()

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
        .custom(isValidDate)
        .withMessage({ error: 'Enter a valid date' })
        .bail()
        .custom(isPastDate)
        .withMessage({ error: 'Date cannot be in the future' })
        .bail()
        .custom((value) => DateTime.fromISO(value) > DateTime.fromISO(offenderDateOfBirth))
        .withMessage({ error: 'Date must be later than the individual’s date of birth' })
        .bail()
        .custom((value) => {
          const diff = intervalFrom(offenderDateOfBirth, value)
          return diff.length('years') >= 8
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
        .custom(isValidDate)
        .withMessage({ error: 'Enter a valid date' })
        .bail()
        .custom(isPastDate)
        .withMessage({ error: 'Date cannot be in the future' })
        .bail()
        .custom((value) => DateTime.fromISO(value) > DateTime.fromISO(offenderDateOfBirth))
        .withMessage({ error: 'Date must be later than the individual’s date of birth' }),
    )

    // offender’s age at Date of Current Conviction CANNOT BE LESS than the offender’s age at first conviction
    // i.e. current conviction date cannot be less than first conviction date
    if (
      reqBody[getFieldFor('dateFirstSanction')] &&
      DateTime.fromISO(reqBody[getFieldFor('dateFirstSanction')]).isValid
    ) {
      validations.push(
        body(getFieldFor('currentConvictionDate'))
          .custom((value) => DateTime.fromISO(value) >= DateTime.fromISO(reqBody[getFieldFor('dateFirstSanction')]))
          .withMessage({ error: 'Current conviction cannot be before the date of first conviction' }),
      )
    }

    /// ///////////////////////////////////////////////////
    // Date of most recent sanction involving a sexual or sexually motivated offence:
    if (reqBody[getFieldFor('haveTheyCommittedASexualOffence')] === 'YES') {
      validations.push(
        body(getFieldFor('dateOfMostRecentSexualOffence'))
          .custom(isValidDate)
          .withMessage({ error: 'Enter a valid date' })
          .bail()
          .custom(isPastDate)
          .withMessage({ error: 'Date cannot be in the future' })
          .bail()
          .custom((value) => DateTime.fromISO(value) > DateTime.fromISO(offenderDateOfBirth))
          .withMessage({ error: 'Date must be later than the individual’s date of birth' }),
      )

      validations.push(
        body(getFieldFor('numAdultSexual')).isInt({ min: 0, max: 99 }).withMessage({ error: 'Enter a number' }),
      )
      validations.push(
        body(getFieldFor('numChildSexual')).isInt({ min: 0, max: 99 }).withMessage({ error: 'Enter a number' }),
      )
      validations.push(
        body(getFieldFor('numIndecentImage')).isInt({ min: 0, max: 99 }).withMessage({ error: 'Enter a number' }),
      )
      validations.push(
        body(getFieldFor('numNonContactSexual')).isInt({ min: 0, max: 99 }).withMessage({ error: 'Enter a number' }),
      )
    }

    validations.push(
      body(getFieldFor('dateOfCommencement'))
        .custom(isValidDate)
        .withMessage({ error: 'Enter a valid date' })
        .bail()
        .custom((value) => DateTime.fromISO(value) > DateTime.fromISO(offenderDateOfBirth))
        .withMessage({ error: 'Date must be later than the individual’s date of birth' })
        .bail()
        .custom((value) => {
          const diff = intervalFrom(offenderDateOfBirth, value)
          return diff.length('years') <= 110
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
