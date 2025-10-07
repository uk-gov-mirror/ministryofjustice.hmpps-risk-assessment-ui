import SaveAndContinue from './saveAndContinue'

export const migrateModernSlaveryAnswers = (answers = {}) => {
  return {
    ...answers,
    modern_day_slavery_risks_perpetrator: answers.modern_day_slavery_risks,
    modern_day_slavery_risks_details_perpetrator: answers.modern_day_slavery_risks_details,
    modern_day_slavery_orders_perpetrator: answers.modern_day_slavery_orders,
    modern_day_slavery_orders_details_perpetrator: answers.modern_day_slavery_orders_details,
    modern_day_slavery_safeguarding_perpetrator: answers.modern_day_slavery_safeguarding,
    modern_day_slavery_safeguarding_details_perpetrator: answers.modern_day_slavery_safeguarding_details,
  }
}

export class ModernDaySlaveryPerpetrator extends SaveAndContinue {
  constructor(...args) {
    super(...args)

    // Apply migrations where fields have changed and cleanup unused ones
    this.getAnswerModifiers = [migrateModernSlaveryAnswers]
  }
}
