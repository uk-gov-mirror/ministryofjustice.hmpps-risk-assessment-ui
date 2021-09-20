const {
  range,
  notInFuture,
  validDate,
  dateIsAfter,
  yearsBetweenLessThan,
  yearsBetweenGreaterThan,
} = require('./validators')

describe('checks numbers are in range', () => {
  it('is in the range', () => {
    expect(range(5, 1, 10)).toEqual(true)
  })
  it('is higher than the range', () => {
    expect(range(11, 1, 10)).toEqual(false)
  })
  it('is lower than the range', () => {
    expect(range(0, 1, 10)).toEqual(false)
  })
  it('is at the bottom of the range', () => {
    expect(range(1, 1, 10)).toEqual(true)
  })
  it('is at the top of the range', () => {
    expect(range(10, 1, 10)).toEqual(true)
  })
})

describe('checks date is not in the future', () => {
  it('checks a future date', () => {
    expect(notInFuture('2050-03-26')).toEqual(false)
  })
  it('checks a past date', () => {
    expect(notInFuture('2000-03-26')).toEqual(true)
  })
})

describe('checks date is not in the future', () => {
  it('checks a future date', () => {
    expect(notInFuture('2050-03-26')).toEqual(false)
  })
  it('checks a past date', () => {
    expect(notInFuture('2000-03-26')).toEqual(true)
  })
})

describe('checks dates are valid', () => {
  it('checks a valid date', () => {
    expect(validDate('2020-03-26')).toEqual(true)
  })
  it('checks invalid dates', () => {
    // this date never exists
    expect(validDate('2020-02-30')).toEqual(false)

    // this date didn't exist - not a leap year
    expect(validDate('2021-02-29')).toEqual(false)

    // this date is nonsensical
    expect(validDate('xyz')).toEqual(false)
    expect(validDate('Invalid Date')).toEqual(false)
  })
})

describe('checks order of dates', () => {
  it('checks dates', () => {
    expect(dateIsAfter('2020-03-26', '2020-03-27')).toEqual(false)
    expect(dateIsAfter('2020-03-28', '2020-03-27')).toEqual(true)
  })
})

describe('calculates years between dates greater than', () => {
  it('checks duration', () => {
    expect(yearsBetweenGreaterThan('2020-03-26', '2020-03-27', 1)).toEqual(false)
    expect(yearsBetweenGreaterThan('2015-03-26', '2020-03-27', 5)).toEqual(true)
    expect(yearsBetweenGreaterThan('2020-03-28', '2015-03-27', 5)).toEqual(true)
  })
})

describe('calculates years between dates less than', () => {
  it('checks duration', () => {
    expect(yearsBetweenLessThan('2020-03-26', '2030-03-27', 100)).toEqual(true)
    expect(yearsBetweenLessThan('2020-03-28', '2015-03-27', 5)).toEqual(true)
  })
})
