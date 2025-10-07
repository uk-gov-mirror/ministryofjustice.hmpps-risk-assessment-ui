import { withAnswersFrom } from './saveAndContinue.utils'

const fields = [
  ['text-area-field', { questionCode: 'text-area-field', answerType: 'textarea' }],
  [
    'radio-field',
    { questionCode: 'radio-field', answerType: 'radio', answerDtos: [{ value: 'YES' }, { value: 'NO' }] },
  ],
  ['text-field', { questionCode: 'text-field', answerType: 'freetext' }],
]

describe('withAnswersFrom', () => {
  it('uses the answers from the API as base', () => {
    const apiAnswers = {
      'text-area-field': ['some value'],
      'radio-field': ['YES'],
      'text-field': [],
    }

    const localAnswers = {}

    const updatedQuestions = fields.map(withAnswersFrom(apiAnswers, localAnswers))

    expect(updatedQuestions).toEqual([
      { questionCode: 'text-area-field', answerType: 'textarea', answer: 'some value' },
      {
        questionCode: 'radio-field',
        answerType: 'radio',
        answerDtos: [
          { value: 'YES', checked: true },
          { value: 'NO', checked: false },
        ],
        answer: '',
      },
      { questionCode: 'text-field', answerType: 'freetext', answer: '' },
    ])
  })

  it('applies the submitted answers on top of the base', () => {
    const apiAnswers = {
      'text-area-field': ['some-value'],
      'radio-field': ['YES'],
      'text-field': [],
    }

    const localAnswers = {
      'text-area-field': ['new submitted answer'],
      'text-field': ['new submitted answer'],
    }

    const updatedQuestions = fields.map(withAnswersFrom(apiAnswers, localAnswers))

    expect(updatedQuestions).toEqual([
      { questionCode: 'text-area-field', answerType: 'textarea', answer: 'new submitted answer' },
      {
        questionCode: 'radio-field',
        answerType: 'radio',
        answerDtos: [
          { value: 'YES', checked: true },
          { value: 'NO', checked: false },
        ],
        answer: '',
      },
      { questionCode: 'text-field', answerType: 'freetext', answer: 'new submitted answer' },
    ])
  })
})
