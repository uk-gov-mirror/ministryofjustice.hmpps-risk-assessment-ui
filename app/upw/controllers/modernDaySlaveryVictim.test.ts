import { migrateModernSlaveryAnswers } from './modernDaySlaveryVictim'

describe('it returns previous answers of modern day slavery if present', () => {
  it('returns previous modern day slavery answers when present', () => {
    const answers = {
      modern_day_slavery_risks: ['YES'],
      modern_day_slavery_risks_details: ['YES'],
      modern_day_slavery_safeguarding: ['YES'],
      modern_day_slavery_safeguarding_details: ['YES'],
    }

    const updateAnswers = migrateModernSlaveryAnswers(answers)
    expect(updateAnswers).toStrictEqual({
      ...answers,
      modern_day_slavery_risks_victim: ['YES'],
      modern_day_slavery_risks_details_victim: ['YES'],
      modern_day_slavery_safeguarding_victim: ['YES'],
      modern_day_slavery_safeguarding_details_victim: ['YES'],
    })
  })

  it('does not return previous modern day slavery answers when not present', () => {
    const answers = {
      modern_day_slavery_risks: [],
      modern_day_slavery_risks_details: [],
      modern_day_slavery_safeguarding: [],
      modern_day_slavery_safeguarding_details: [],
    }
    const updateAnswers = migrateModernSlaveryAnswers(answers)
    expect(updateAnswers).toStrictEqual({
      ...answers,
      modern_day_slavery_risks_victim: [],
      modern_day_slavery_risks_details_victim: [],
      modern_day_slavery_safeguarding_victim: [],
      modern_day_slavery_safeguarding_details_victim: [],
    })
  })

  it('does not return previous answers if answers object is empty', () => {
    const answers = {}
    const updateAnswers = migrateModernSlaveryAnswers(answers)
    expect(updateAnswers).toStrictEqual({
      ...answers,
      modern_day_slavery_risks_victim: undefined,
      modern_day_slavery_risks_details_victim: undefined,
      modern_day_slavery_safeguarding_victim: undefined,
      modern_day_slavery_safeguarding_details_victim: undefined,
    })
  })

  it('will return a default value of an empty object if previous answers are undefined', () => {
    const answers = undefined
    const updateAnswers = migrateModernSlaveryAnswers(answers)

    expect(updateAnswers).toEqual({})
  })
})
