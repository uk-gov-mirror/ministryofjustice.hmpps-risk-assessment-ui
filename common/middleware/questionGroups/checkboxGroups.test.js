const { flattenCheckboxGroups, extractCheckboxGroupAnswers } = require('./checkboxGroups')

describe('checkboxGroups', () => {
  const checkboxGroup = {
    type: 'checkboxGroup',
    checkboxGroupId: '91a60f48-89d4-4106-8f8a-fe797edca111',
    checkboxGroupCode: 'checkbox_group',
    title: 'Checkbox group',
    displayOrder: 1,
    contents: [
      {
        type: 'question',
        questionId: '0941c5b2-f42d-4120-ad79-44954674fe00',
        questionCode: '1.1',
        answerType: 'checkbox',
        questionText: 'First option',
        displayOrder: 1,
        mandatory: true,
        readOnly: false,
        conditional: false,
        referenceDataTargets: [],
        answerDtos: [
          {
            answerUuid: '59a0f4fe-4cca-426b-9402-0236dae24902',
            answerSchemaCode: 'yes',
            value: 'YES',
            text: 'Yes',
          },
          {
            answerUuid: 'c36d2ccd-c049-4640-806e-34b012f682d8',
            answerSchemaCode: 'no',
            value: 'NO',
            text: 'No',
          },
        ],
      },
      {
        type: 'question',
        questionId: 'f988f76c-3d6c-4f45-aa29-7dc8d11198d7',
        questionCode: '1.2',
        answerType: 'checkbox',
        questionText: 'Second option',
        displayOrder: 2,
        mandatory: true,
        readOnly: false,
        conditional: false,
        referenceDataTargets: [],
        answerDtos: [
          {
            answerUuid: '59a0f4fe-4cca-426b-9402-0236dae24902',
            answerSchemaCode: 'yes',
            value: 'YES',
            text: 'Yes',
          },
          {
            answerUuid: 'c36d2ccd-c049-4640-806e-34b012f682d8',
            answerSchemaCode: 'no',
            value: 'NO',
            text: 'No',
          },
        ],
      },
    ],
  }

  describe('flattenCheckboxGroups', () => {
    it('flattens a checkbox group in to a single question', () => {
      const questions = flattenCheckboxGroups([checkboxGroup])
      expect(questions).toEqual([
        {
          type: 'question',
          questionId: '91a60f48-89d4-4106-8f8a-fe797edca111',
          questionCode: 'checkbox_group',
          displayOrder: 1,
          answerType: 'checkboxGroup',
          questionText: 'Checkbox group',
          mandatory: true,
          readOnly: false,
          conditional: false,
          answerDtos: [
            { text: 'First option', value: '0941c5b2-f42d-4120-ad79-44954674fe00' },
            { text: 'Second option', value: 'f988f76c-3d6c-4f45-aa29-7dc8d11198d7' },
          ],
        },
      ])
    })
  })

  describe('extractCheckboxGroupAnswers', () => {
    it('extracts checkbox group answers', () => {
      const answers = {
        '91a60f48-89d4-4106-8f8a-fe797edca111': [
          '0941c5b2-f42d-4120-ad79-44954674fe00',
          'f988f76c-3d6c-4f45-aa29-7dc8d11198d7',
        ],
      }
      const extractedAnswers = extractCheckboxGroupAnswers([checkboxGroup], answers)

      expect(extractedAnswers).toEqual({
        '0941c5b2-f42d-4120-ad79-44954674fe00': ['YES'],
        'f988f76c-3d6c-4f45-aa29-7dc8d11198d7': ['YES'],
      })
    })

    it('defaults to second answer value when unchecked', () => {
      const answers = {
        '91a60f48-89d4-4106-8f8a-fe797edca111': ['0941c5b2-f42d-4120-ad79-44954674fe00'],
      }
      const extractedAnswers = extractCheckboxGroupAnswers([checkboxGroup], answers)

      expect(extractedAnswers).toEqual({
        '0941c5b2-f42d-4120-ad79-44954674fe00': ['YES'],
        'f988f76c-3d6c-4f45-aa29-7dc8d11198d7': ['NO'],
      })
    })
  })
})
