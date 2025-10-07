import SaveAndContinue from './saveAndContinue'

export const migrateModernSlaveryAnswers = (answers = {}) => {
  return {
    ...answers,
    modern_day_slavery_risks_victim: answers.modern_day_slavery_risks,
    modern_day_slavery_risks_details_victim: answers.modern_day_slavery_risks_details,
    modern_day_slavery_safeguarding_victim: answers.modern_day_slavery_safeguarding,
    modern_day_slavery_safeguarding_details_victim: answers.modern_day_slavery_safeguarding_details,
  }
}

export class ModernDaySlaveryVictim extends SaveAndContinue {
  constructor(...args) {
    super(...args)

    // Apply migrations where fields have changed and cleanup unused ones
    this.getAnswerModifiers = [migrateModernSlaveryAnswers]
  }
}
