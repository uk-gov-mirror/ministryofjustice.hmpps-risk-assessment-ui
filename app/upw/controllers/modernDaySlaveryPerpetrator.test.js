import { migrateModernSlaveryAnswers } from './modernDaySlaveryPerpetrator'

describe('it returns previous answers of modern day slavery if present', () => {
  it('it returns previous modern day slavery answers when present', () => {
    const answers = {
      modern_day_slavery_risks: ['YES'],
      modern_day_slavery_risks_details: ['YES'],
      modern_day_slavery_orders: ['YES'],
      modern_day_slavery_orders_details: ['YES'],
      modern_day_slavery_safeguarding: ['YES'],
      modern_day_slavery_safeguarding_details: ['YES'],
    }

    const updateAnswers = migrateModernSlaveryAnswers(answers)
    expect(updateAnswers).toStrictEqual({
      ...answers,
      modern_day_slavery_risks_perpetrator: ['YES'],
      modern_day_slavery_risks_details_perpetrator: ['YES'],
      modern_day_slavery_orders_perpetrator: ['YES'],
      modern_day_slavery_orders_details_perpetrator: ['YES'],
      modern_day_slavery_safeguarding_perpetrator: ['YES'],
      modern_day_slavery_safeguarding_details_perpetrator: ['YES'],
    })
  })

  it('it does not return previous modern day slavery answers when not present', () => {
    const answers = {
      modern_day_slavery_risks: [],
      modern_day_slavery_risks_details: [],
      modern_day_slavery_orders: [],
      modern_day_slavery_orders_details: [],
      modern_day_slavery_safeguarding: [],
      modern_day_slavery_safeguarding_details: [],
    }
    const updateAnswers = migrateModernSlaveryAnswers(answers)
    expect(updateAnswers).toStrictEqual({
      ...answers,
      modern_day_slavery_risks_perpetrator: [],
      modern_day_slavery_risks_details_perpetrator: [],
      modern_day_slavery_orders_perpetrator: [],
      modern_day_slavery_orders_details_perpetrator: [],
      modern_day_slavery_safeguarding_perpetrator: [],
      modern_day_slavery_safeguarding_details_perpetrator: [],
    })
  })

  it('does not return previous answers if answers object is empty', () => {
    const answers = {}
    const updateAnswers = migrateModernSlaveryAnswers(answers)
    expect(updateAnswers).toStrictEqual({
      ...answers,
      modern_day_slavery_risks_perpetrator: undefined,
      modern_day_slavery_risks_details_perpetrator: undefined,
      modern_day_slavery_orders_perpetrator: undefined,
      modern_day_slavery_orders_details_perpetrator: undefined,
      modern_day_slavery_safeguarding_perpetrator: undefined,
      modern_day_slavery_safeguarding_details_perpetrator: undefined,
    })
  })

  it('will return a default value of an empty object if previous answers are undefined', () => {
    const answers = undefined
    const updateAnswers = migrateModernSlaveryAnswers(answers)

    expect(updateAnswers).toEqual({})
  })
})
