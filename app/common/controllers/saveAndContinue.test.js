const { configure } = require('nunjucks')
const SaveAndContinueController = require('./saveAndContinue')
const { getAnswers, postAnswers, getFlatAssessmentQuestions } = require('../../../common/data/hmppsAssessmentApi')
const { processReplacements, encodeHTML, updateJsonValue } = require('../../../common/utils/util')

const nunjucksEnvironment = configure({}, {})
nunjucksEnvironment.addFilter('encodeHtml', (str) => encodeHTML(str))
nunjucksEnvironment.addFilter('addSpellcheck', (jsonObj) => updateJsonValue(jsonObj, 'spellcheck', true, true))

jest.mock('../../../common/data/hmppsAssessmentApi')
jest.mock('../../../common/utils/util')

let req
const user = { token: 'mytoken', id: '1' }
const assessmentUuid = '22222222-2222-2222-2222-222222222221'
const episodeUuid = '22222222-2222-2222-2222-222222222222'

const controller = new SaveAndContinueController({
  route: 'test-route',
})

describe('SaveAndContinueController', () => {
  const mockSessionModel = (values = {}) => {
    req.sessionModel.get.mockImplementation((key) => {
      switch (key) {
        case 'errors':
          return values.errors
        case 'answers':
          return values.answers
        case 'formAnswers':
          return values.formAnswers
        case 'persistedAnswers':
          return values.persistedAnswers
        default:
          return undefined
      }
    })
  }

  const inputWithName = (name) => new RegExp(`<input[^>]*?name=(["\\'])?${name}((?:.(?!\\1|>))*.?)\\1?`)

  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
    locals: {
      'csrf-token': 'CSRF_TOKEN',
    },
  }

  const next = jest.fn()

  beforeEach(() => {
    req = {
      user,
      body: {},
      sessionModel: {
        set: jest.fn(),
        get: jest.fn(),
      },
      session: {
        assessment: {
          uuid: assessmentUuid,
          episodeUuid,
          subject: { dob: '1980-01-01' },
        },
      },
      form: {
        options: {
          allFields: {},
          fields: {},
          journeyName: 'RSR',
        },
        values: {},
      },
    }

    res.render.mockReset()
    req.sessionModel.get.mockReset()
    req.sessionModel.set.mockReset()
    req.form.options.fields = {}
    req.form.options.allFields = {}

    delete res.locals.questionGroupCode
    delete res.locals.multipleToEdit
    delete res.locals.addingNewMultiple
    delete res.locals.addNewMultiple
    delete res.locals.multipleUpdated

    next.mockReset()

    getAnswers.mockReset()
    postAnswers.mockReset()
    getFlatAssessmentQuestions.mockReset()
    processReplacements.mockReset()

    processReplacements.mockImplementation((questions) => questions)
    getAnswers.mockResolvedValue({ answers: {} })
  })

  describe('locals', () => {
    it('puts the CSRF token in to locals', async () => {
      mockSessionModel()

      await controller.locals(req, res, () => {})

      expect(res.locals.csrfToken).toEqual('CSRF_TOKEN')
    })

    it('puts the assessment in to locals', async () => {
      mockSessionModel()

      await controller.locals(req, res, () => {})

      expect(res.locals.assessment).toEqual(req.session.assessment)
    })

    it('puts form errors in to locals', async () => {
      mockSessionModel({ errors: [{ message: 'field error', key: 'some_field' }] })
      await controller.locals(req, res, () => {})

      expect(req.sessionModel.get).toHaveBeenCalledWith('errors')
      expect(res.locals.errors).toEqual({
        some_field: {
          text: 'field error',
        },
      })
      expect(res.locals.errorSummary).toEqual([{ href: '#some_field-error', text: 'field error' }])
    })

    it('pre-renders conditional questions', async () => {
      const fields = {
        first_question: {
          questionCode: 'first_question',
          questionText: 'First Question',
          answerType: 'radio',
          answerDtos: [
            { value: 'YES', text: 'Yes' },
            { value: 'NO', text: 'No' },
          ],
          validate: [],
        },
        second_question: {
          questionCode: 'second_question',
          questionText: 'Second Question',
          answerType: 'numeric',
          answer: '',
          dependent: { field: 'first_question', value: 'YES' },
          validate: [],
        },
      }

      req.form.options.fields = fields
      req.form.options.allFields = fields

      mockSessionModel({
        answers: {
          first_question: ['YES'],
        },
      })

      await controller.locals(req, res, () => {})

      const [yesAnswer] = res.locals.questions.first_question.answerDtos
      expect(yesAnswer.conditional?.html).toMatch(inputWithName('second_question'))
    })

    it('pre-renders nested conditional questions', async () => {
      const fields = {
        first_question: {
          questionCode: 'first_question',
          questionText: 'First Question',
          answerType: 'radio',
          answerDtos: [
            { value: 'YES', text: 'Yes' },
            { value: 'NO', text: 'No' },
          ],
          validate: [],
        },
        second_question: {
          questionCode: 'second_question',
          questionText: 'Second Question',
          answerType: 'radio',
          answerDtos: [
            { value: 'YES', text: 'Yes' },
            { value: 'NO', text: 'No' },
          ],
          dependent: { field: 'first_question', value: 'YES' },
          validate: [],
        },
        third_question: {
          questionCode: 'third_question',
          questionText: 'Third Question',
          answerType: 'numeric',
          answer: '',
          dependent: { field: 'second_question', value: 'NO' },
          validate: [],
        },
      }

      req.form.options.fields = fields
      req.form.options.allFields = fields

      mockSessionModel({
        answers: {
          first_question: 'YES',
          second_question: 'NO',
        },
      })

      await controller.locals(req, res, () => {})

      const [yesAnswer] = res.locals.questions.first_question.answerDtos
      expect(yesAnswer.conditional?.html).toMatch(inputWithName('second_question'))
      expect(yesAnswer.conditional?.html).toMatch(inputWithName('third_question'))
    })

    it('maps answers on to questions', async () => {
      const fields = {
        first_question: {
          questionCode: 'first_question',
          answerType: 'numeric',
        },
        second_question: {
          questionCode: 'second_question',
          answerType: 'numeric',
        },
        third_question: {
          questionCode: 'third_question',
          answerType: 'numeric',
        },
        fourth_question: {
          questionCode: 'fourth_question',
          answerType: 'numeric',
          default: 'TEST',
        },
      }

      const allFields = {
        ...fields,
        fifth_question: {
          questionCode: 'fifth_question',
          answerType: 'numeric',
          default: 'TEST',
        },
      }

      getAnswers.mockResolvedValue({
        answers: {
          first_question: ['FOO'],
          second_question: ['BAR'],
          fifth_question: ['BAZ'],
        },
      })

      req.form.options.fields = fields
      req.form.options.allFields = allFields

      await controller.locals(req, res, () => {})

      expect(res.locals.questions).toEqual({
        first_question: {
          questionCode: 'first_question',
          answerType: 'numeric',
          answer: 'FOO',
        },
        second_question: {
          questionCode: 'second_question',
          answerType: 'numeric',
          answer: 'BAR',
        },
        third_question: {
          questionCode: 'third_question',
          answerType: 'numeric',
          answer: '',
        },
        fourth_question: {
          questionCode: 'fourth_question',
          answerType: 'numeric',
          default: 'TEST',
          answer: 'TEST',
        },
      })
    })

    it('prefers local answers to remote when mapping on to questions', async () => {
      const fields = {
        first_question: {
          questionCode: 'first_question',
          answerType: 'numeric',
        },
        second_question: {
          questionCode: 'second_question',
          answerType: 'numeric',
        },
        third_question: {
          questionCode: 'third_question',
          answerType: 'numeric',
        },
      }

      mockSessionModel({
        formAnswers: {
          first_question: 'SUBMITTED_FOO',
          second_question: '',
          third_question: '',
        },
      })

      req.form.options.fields = fields
      req.form.options.allFields = fields

      getAnswers.mockResolvedValue({
        answers: {
          first_question: ['PREVIOUS_FOO'],
          second_question: [],
          third_question: ['PREVIOUS_BAR'],
        },
      })

      await controller.locals(req, res, () => {})

      expect(getAnswers).toHaveBeenCalledWith(
        req.session.assessment.uuid,
        req.session.assessment.episodeUuid,
        req.user.token,
        req.user.id,
      )

      expect(res.locals.questions).toEqual({
        first_question: {
          questionCode: 'first_question',
          answerType: 'numeric',
          answer: 'SUBMITTED_FOO',
        },
        second_question: {
          questionCode: 'second_question',
          answerType: 'numeric',
          answer: '',
        },
        third_question: {
          questionCode: 'third_question',
          answerType: 'numeric',
          answer: 'PREVIOUS_BAR',
        },
      })
    })

    it('applies processReplacements for questions', async () => {
      await controller.locals(req, res, () => {})

      expect(processReplacements).toHaveBeenCalledWith(expect.anything(), req.session.assessment.subject)
    })

    it('stores questions in locals', async () => {
      const fields = {
        date_first_sanction: {
          questionCode: 'date_first_sanction',
          answerType: 'date',
        },
      }

      req.form.options.fields = fields
      req.form.options.allFields = fields

      mockSessionModel()

      await controller.locals(req, res, () => {})

      expect(res.locals.questions).toEqual({
        date_first_sanction: {
          questionCode: 'date_first_sanction',
          answerType: 'date',
          answer: '',
        },
      })
    })

    it('presents the correct multiple for editing', async () => {
      res.locals.questionGroupCode = 'emergency_contact_details'
      res.locals.questionGroupIndex = '1'
      const fields = {
        contact_address_house_number: { answer: '', questionCode: '1' },
        emergency_contact_first_name: {
          type: 'multiple',
          answerGroup: 'emergency_contact_details',
          answer: '',
          questionCode: 'emergency_contact_first_name',
        },
        emergency_contact_family_name: {
          type: 'multiple',
          answerGroup: 'emergency_contact_details',
          answer: '',
          questionCode: 'emergency_contact_family_name',
        },
      }

      getAnswers.mockResolvedValue({
        answers: {
          contact_address_house_number: '23',
          emergency_contact_details: [
            {
              emergency_contact_first_name: ['George'],
              emergency_contact_family_name: ['Costanza'],
            },
            {
              emergency_contact_first_name: ['Alan'],
              emergency_contact_family_name: ['Moore'],
            },
          ],
        },
      })

      getFlatAssessmentQuestions.mockResolvedValue([
        { questionCode: 'contact_address_house_number', questionText: 'contact_address_house_number question text' },
        { questionCode: 'emergency_contact_details', questionText: 'Age at first sanction' },
      ])

      req.form.options.fields = fields
      req.form.options.allFields = fields

      await controller.locals(req, res, () => {})

      expect(res.locals.questions.emergency_contact_family_name.answer).toEqual('Moore')
      expect(res.locals.questions.emergency_contact_first_name.answer).toEqual('Alan')
    })

    it('presents a blank multiple when adding a new multiple', async () => {
      res.locals.questionGroupCode = 'emergency_contact_details'
      res.locals.addingNewMultiple = true
      const fields = {
        contact_address_house_number: { answer: '', questionCode: '1' },
        emergency_contact_first_name: {
          type: 'multiple',
          answerGroup: 'emergency_contact_details',
          answer: '',
          questionCode: 'emergency_contact_first_name',
        },
        emergency_contact_family_name: {
          type: 'multiple',
          answerGroup: 'emergency_contact_details',
          answer: '',
          questionCode: 'emergency_contact_family_name',
        },
      }

      getAnswers.mockResolvedValue({
        answers: {
          contact_address_house_number: '23',
          emergency_contact_details: [
            {
              emergency_contact_first_name: ['George'],
              emergency_contact_family_name: ['Costanza'],
            },
            {
              emergency_contact_first_name: ['Alan'],
              emergency_contact_family_name: ['Moore'],
            },
          ],
        },
      })

      getFlatAssessmentQuestions.mockResolvedValue([
        { questionCode: 'contact_address_house_number', questionText: 'contact_address_house_number question text' },
        { questionCode: 'emergency_contact_details', questionText: 'Age at first sanction' },
      ])

      req.form.options.fields = fields
      req.form.options.allFields = fields

      await controller.locals(req, res, () => {})

      expect(res.locals.clearQuestionAnswers).toEqual(true)
    })

    it('presents answer just submitted when there is a form error', async () => {
      res.locals.questionGroupCode = 'emergency_contact_details'
      res.locals.addingNewMultiple = true
      mockSessionModel({ errors: [{ message: 'field error', key: 'emergency_contact_first_name' }] })

      req.form.values.emergency_contact_first_name = 'first_name'
      req.form.values.emergency_contact_family_name = 'family_name'

      const fields = {
        contact_address_house_number: { answer: '', questionCode: '1' },
        emergency_contact_first_name: {
          type: 'multiple',
          answerGroup: 'emergency_contact_details',
          answer: '',
          questionCode: 'emergency_contact_first_name',
        },
        emergency_contact_family_name: {
          type: 'multiple',
          answerGroup: 'emergency_contact_details',
          answer: '',
          questionCode: 'emergency_contact_family_name',
        },
      }

      getAnswers.mockResolvedValue({
        answers: {
          contact_address_house_number: '23',
          emergency_contact_details: [
            {
              emergency_contact_first_name: ['George'],
              emergency_contact_family_name: ['Costanza'],
            },
            {
              emergency_contact_first_name: ['Alan'],
              emergency_contact_family_name: ['Moore'],
            },
          ],
        },
      })

      getFlatAssessmentQuestions.mockResolvedValue([
        { questionCode: 'contact_address_house_number', questionText: 'contact_address_house_number question text' },
        { questionCode: 'emergency_contact_details', questionText: 'Age at first sanction' },
      ])

      req.form.options.fields = fields
      req.form.options.allFields = fields

      await controller.locals(req, res, () => {})

      expect(res.locals.questions.emergency_contact_family_name.answer).toEqual('family_name')
      expect(res.locals.questions.emergency_contact_first_name.answer).toEqual('first_name')
    })
  })

  describe('configure', () => {
    it('combines remote and local field configurations', async () => {
      getFlatAssessmentQuestions.mockResolvedValue([
        { questionCode: 'age_first_conviction', questionText: 'Age at first sanction' },
      ])

      await controller.configure(req, res, next)

      expect(getFlatAssessmentQuestions).toHaveBeenCalledWith('RSR', user.token, user.id)
    })

    it('displays an error when no assessment is selected', async () => {
      delete req.session.assessment

      await controller.configure(req, res, next)

      expect(next).toHaveBeenCalledWith(new Error('No assessment selected'))
    })
  })

  describe('process', () => {
    it('combines date fields', async () => {
      req.form.options.fields = {
        date_field: {
          questionCode: 'date_field',
          answerType: 'date',
        },
      }

      req.body = {
        'date_field-day': '2',
        'date_field-month': '9',
        'date_field-year': '2018',
      }

      await controller.process(req, res, next)

      expect(req.form.values).toEqual({
        date_field: '2018-09-02',
      })
    })

    it('returns empty when the date has no day component', async () => {
      req.form.options.fields = {
        date_field: {
          questionCode: 'date_field',
          answerType: 'date',
        },
      }

      req.body = {
        'date_field-day': '',
        'date_field-month': '9',
        'date_field-year': '2018',
      }

      await controller.process(req, res, next)

      expect(req.form.values).toEqual({
        date_field: '',
      })

      expect(req.sessionModel.set).toHaveBeenCalledWith('formAnswers', req.form.values)
    })

    it('returns empty when the date has no month component', async () => {
      req.form.options.fields = {
        date_field: {
          questionCode: 'date_field',
          answerType: 'date',
        },
      }

      req.body = {
        'date_field-day': '2',
        'date_field-month': '',
        'date_field-year': '2018',
      }

      await controller.process(req, res, next)

      expect(req.form.values).toEqual({
        date_field: '',
      })

      expect(req.sessionModel.set).toHaveBeenCalledWith('formAnswers', req.form.values)
    })

    it('returns empty when the date has no year component', async () => {
      req.form.options.fields = {
        date_field: {
          questionCode: 'date_field',
          answerType: 'date',
        },
      }

      req.body = {
        'date_field-day': '2',
        'date_field-month': '9',
        'date_field-year': '',
      }

      await controller.process(req, res, next)

      expect(req.form.values).toEqual({
        date_field: '',
      })

      expect(req.sessionModel.set).toHaveBeenCalledWith('formAnswers', req.form.values)
    })
  })

  describe('saveValues', () => {
    it('saves the answers', async () => {
      postAnswers.mockResolvedValue([true, { episodeUuid }])
      mockSessionModel({
        formAnswers: {
          some_field: ['foo'],
          some_selection_field: ['bar'],
          some_empty_selection_field: [],
          some_empty_field: '',
        },
      })

      await controller.saveValues(req, res, next)

      expect(req.sessionModel.get).toHaveBeenCalledWith('formAnswers')
      expect(postAnswers).toHaveBeenCalledWith(
        assessmentUuid,
        episodeUuid,
        {
          answers: {
            some_field: ['foo'],
            some_selection_field: ['bar'],
            some_empty_selection_field: [],
            some_empty_field: [],
          },
        },
        user.token,
        user.id,
      )
    })

    it('adds a new item to a multiples group', async () => {
      postAnswers.mockResolvedValue([true, { episodeUuid }])
      res.locals.addNewMultiple = 'emergency_contact_details'

      const fields = {
        contact_address_house_number: {},
        emergency_contact_first_name: {
          type: 'multiple',
          answerGroup: 'emergency_contact_details',
        },
        emergency_contact_family_name: {
          type: 'multiple',
          answerGroup: 'emergency_contact_details',
        },
      }

      req.form.options.fields = fields
      req.form.options.allFields = fields

      mockSessionModel({
        formAnswers: {
          contact_address_house_number: '23',
          emergency_contact_first_name: 'New',
          emergency_contact_family_name: 'Name',
        },
        persistedAnswers: {
          contact_address_house_number: ['23'],
          emergency_contact_details: [
            {
              emergency_contact_first_name: ['George'],
              emergency_contact_family_name: ['Costanza'],
            },
            {
              emergency_contact_first_name: ['Alan'],
              emergency_contact_family_name: ['Moore'],
            },
          ],
          emergency_contact_first_name: ['New'],
          emergency_contact_family_name: ['Name'],
        },
      })

      await controller.saveValues(req, res, next)

      expect(req.sessionModel.get).toHaveBeenCalledWith('persistedAnswers')
      expect(postAnswers).toHaveBeenCalledWith(
        assessmentUuid,
        episodeUuid,
        {
          answers: {
            contact_address_house_number: ['23'],
            emergency_contact_details: [
              {
                emergency_contact_first_name: ['George'],
                emergency_contact_family_name: ['Costanza'],
              },
              {
                emergency_contact_first_name: ['Alan'],
                emergency_contact_family_name: ['Moore'],
              },
              {
                emergency_contact_first_name: ['New'],
                emergency_contact_family_name: ['Name'],
              },
            ],
          },
        },
        user.token,
        user.id,
      )
    })

    it('updates an existing multiples group', async () => {
      postAnswers.mockResolvedValue([true, { episodeUuid }])
      res.locals.questionGroupCode = 'emergency_contact_details'
      res.locals.multipleUpdated = '1'

      const fields = {
        contact_address_house_number: {},
        emergency_contact_first_name: {
          type: 'multiple',
          answerGroup: 'emergency_contact_details',
        },
        emergency_contact_family_name: {
          type: 'multiple',
          answerGroup: 'emergency_contact_details',
        },
      }

      req.form.options.fields = fields
      req.form.options.allFields = fields

      mockSessionModel({
        formAnswers: {
          contact_address_house_number: '23',
          emergency_contact_first_name: 'New',
          emergency_contact_family_name: 'Name',
        },
        persistedAnswers: {
          contact_address_house_number: ['23'],
          emergency_contact_details: [
            {
              emergency_contact_first_name: ['George'],
              emergency_contact_family_name: ['Costanza'],
            },
            {
              emergency_contact_first_name: ['Alan'],
              emergency_contact_family_name: ['Moore'],
            },
          ],
          emergency_contact_first_name: ['New'],
          emergency_contact_family_name: ['Name'],
        },
      })

      await controller.saveValues(req, res, next)

      expect(req.sessionModel.get).toHaveBeenCalledWith('persistedAnswers')
      expect(postAnswers).toHaveBeenCalledWith(
        assessmentUuid,
        episodeUuid,
        {
          answers: {
            contact_address_house_number: ['23'],
            emergency_contact_details: [
              {
                emergency_contact_first_name: ['George'],
                emergency_contact_family_name: ['Costanza'],
              },
              {
                emergency_contact_first_name: ['New'],
                emergency_contact_family_name: ['Name'],
              },
            ],
          },
        },
        user.token,
        user.id,
      )
    })

    it('displays an error if answer saving fails', async () => {
      const theError = new Error('Error message')
      postAnswers.mockRejectedValue(theError)
      mockSessionModel()

      await controller.saveValues(req, res, next)

      expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
    })
  })
})
