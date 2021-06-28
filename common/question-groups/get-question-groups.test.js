// Initialise nunjucks environment
const { configure } = require('nunjucks')

const nunjucksEnvironment = configure({}, {})
const dateFilter = require('nunjucks-date-filter')
const { encodeHTML } = require('../utils/util')
const { mojDate } = require('../../node_modules/@ministryofjustice/frontend/moj/filters/all')()
// add custom nunjucks filters
nunjucksEnvironment.addFilter('date', dateFilter)
nunjucksEnvironment.addFilter('mojDate', mojDate)
nunjucksEnvironment.addFilter('encodeHtml', str => encodeHTML(str))

const { compileInlineConditionalQuestions } = require('./get-question-groups')

const questions = [
  {
    type: 'question',
    questionId: '11111111-1111-1111-1111-111111111231',
    questionCode: 'no_fixed_abode',
    answerType: 'radio',
    questionText: 'Currently of no fixed abode or in transient accommodation',
    displayOrder: '1',
    mandatory: 'no',
    validation: '{"mandatory":{"errorMessage":"Select an option","errorSummary":"Select an accommodation status"}}',
    answerSchemas: [
      {
        answerSchemaUuid: '44444444-4444-4444-4444-444444444444',
        answerSchemaCode: 'SR15.1.2.1',
        value: 'Y',
        text: 'Yes',
        conditionals: [
          {
            conditional: 'conditional-question-id-1111111',
            displayInline: true,
          },
        ],
      },
      {
        answerSchemaUuid: '44444444-4444-4444-4444-444444444445',
        answerSchemaCode: 'SR15.1.2.2',
        value: 'N',
        text: 'No',
      },
    ],
    attributes: {
      'data-question-uuid': '11111111-1111-1111-1111-111111111231',
      'data-question-type': 'radio',
    },
  },
  {
    type: 'question',
    questionId: 'conditional-question-id-1111111',
    questionCode: 'Further information',
    answerType: 'textarea',
    questionText: 'Further information',
    displayOrder: '1',
    mandatory: 'no',
    conditional: 'yes',
    answerSchemas: [],
    answer: null,
    validation:
      '{"mandatory":{"errorMessage":"Enter some details","errorSummary":"Enter more detail about the accommodation"}}',
    attributes: {
      'data-question-uuid': 'conditional-question-id-1111111',
      'data-question-type': 'textarea',
    },
  },
]

describe('process conditional questions', () => {
  it('should compile inline conditional questions', () => {
    const thisQuestionGroup = JSON.parse(JSON.stringify(questions))
    const expected = [
      {
        answerSchemas: [
          {
            answerSchemaCode: 'SR15.1.2.1',
            answerSchemaUuid: '44444444-4444-4444-4444-444444444444',
            conditional: {
              html:
                ' <div class="govuk-character-count" data-module="govuk-character-count" data-maxlength="4000"><div class="govuk-form-group"><label class="govuk-label Further information govuk-label--m" for="id-conditional-question-id-1111111">Further information</label><div id="id-conditional-question-id-1111111-hint" class="govuk-hint"></div><textarea class="govuk-textarea govuk-js-character-count" id="id-conditional-question-id-1111111" name="id-conditional-question-id-1111111" rows="5" aria-describedby="id-conditional-question-id-1111111-info id-conditional-question-id-1111111-hint" 0="{" 1="&quot;" 2="d" 3="a" 4="t" 5="a" 6="-" 7="q" 8="u" 9="e" 10="s" 11="t" 12="i" 13="o" 14="n" 15="-" 16="u" 17="u" 18="i" 19="d" 20="&quot;" 21=":" 22="&quot;" 23="c" 24="o" 25="n" 26="d" 27="i" 28="t" 29="i" 30="o" 31="n" 32="a" 33="l" 34="-" 35="q" 36="u" 37="e" 38="s" 39="t" 40="i" 41="o" 42="n" 43="-" 44="i" 45="d" 46="-" 47="1" 48="1" 49="1" 50="1" 51="1" 52="1" 53="1" 54="&quot;" 55="," 56="&quot;" 57="d" 58="a" 59="t" 60="a" 61="-" 62="q" 63="u" 64="e" 65="s" 66="t" 67="i" 68="o" 69="n" 70="-" 71="t" 72="y" 73="p" 74="e" 75="&quot;" 76=":" 77="&quot;" 78="t" 79="e" 80="x" 81="t" 82="a" 83="r" 84="e" 85="a" 86="&quot;" 87="}"></textarea>\n</div><div id="id-conditional-question-id-1111111-info" class="govuk-hint govuk-character-count__message" aria-live="polite">You can enter up to 4000 characters\n</div></div>',
            },
            conditionals: [
              {
                conditional: 'conditional-question-id-1111111',
                displayInline: true,
              },
            ],
            text: 'Yes',
            value: 'Y',
          },
          {
            answerSchemaCode: 'SR15.1.2.2',
            answerSchemaUuid: '44444444-4444-4444-4444-444444444445',
            text: 'No',
            value: 'N',
          },
        ],
        answerType: 'radio',
        attributes: {
          'data-question-type': 'radio',
          'data-question-uuid': '11111111-1111-1111-1111-111111111231',
        },
        displayOrder: '1',
        mandatory: 'no',
        questionCode: 'no_fixed_abode',
        questionId: '11111111-1111-1111-1111-111111111231',
        questionText: 'Currently of no fixed abode or in transient accommodation',
        type: 'question',
        validation: '{"mandatory":{"errorMessage":"Select an option","errorSummary":"Select an accommodation status"}}',
      },
    ]
    const result = compileInlineConditionalQuestions(thisQuestionGroup, {})
    expect(result).toEqual(expected)
  })

  it('should compile out-of-line conditional questions', () => {
    const thisQuestionGroup = JSON.parse(JSON.stringify(questions))
    thisQuestionGroup[0].answerSchemas[0].conditionals[0].displayInline = false

    const expected = [
      {
        answerSchemas: [
          {
            answerSchemaCode: 'SR15.1.2.1',
            answerSchemaUuid: '44444444-4444-4444-4444-444444444444',
            attributes: [
              ['data-conditional', 'conditional-question-id-1111111'],
              ['data-aria-controls', 'conditional-id-form-conditional-question-id-1111111'],
              ['aria-expanded', 'false'],
            ],
            conditionals: [
              {
                conditional: 'conditional-question-id-1111111',
                displayInline: false,
              },
            ],
            text: 'Yes',
            value: 'Y',
          },
          {
            answerSchemaCode: 'SR15.1.2.2',
            answerSchemaUuid: '44444444-4444-4444-4444-444444444445',
            text: 'No',
            value: 'N',
          },
        ],
        answerType: 'radio',
        attributes: [['data-contains-conditional', 'true']],
        displayOrder: '1',
        isConditional: true,
        mandatory: 'no',
        questionCode: 'no_fixed_abode',
        questionId: '11111111-1111-1111-1111-111111111231',
        questionText: 'Currently of no fixed abode or in transient accommodation',
        type: 'question',
        validation: '{"mandatory":{"errorMessage":"Select an option","errorSummary":"Select an accommodation status"}}',
      },
      {
        answer: null,
        answerSchemas: [],
        answerType: 'textarea',
        attributes: [
          ['data-outofline', 'true'],
          ['data-base-id', 'conditional-question-id-1111111'],
        ],
        conditional: 'yes',
        displayOrder: '1',
        formClasses: 'govuk-radios__conditional govuk-radios__conditional--no-indent govuk-radios__conditional--hidden',
        isConditional: true,
        mandatory: 'no',
        questionCode: 'Further information',
        questionId: 'conditional-question-id-1111111',
        questionText: 'Further information',
        type: 'question',
        validation:
          '{"mandatory":{"errorMessage":"Enter some details","errorSummary":"Enter more detail about the accommodation"}}',
      },
    ]
    const result = compileInlineConditionalQuestions(thisQuestionGroup, {})
    expect(result).toEqual(expected)
  })
})
