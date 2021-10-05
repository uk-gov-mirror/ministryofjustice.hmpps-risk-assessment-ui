const { configure } = require('nunjucks')
const SaveAndContinueController = require('./saveAndContinue')
const { getAnswers, postAnswers, getFlatAssessmentQuestions } = require('../../../common/data/hmppsAssessmentApi')
const { customValidations } = require('../fields')
const { processReplacements, encodeHTML } = require('../../../common/utils/util')

const nunjucksEnvironment = configure({}, {})
nunjucksEnvironment.addFilter('encodeHtml', str => encodeHTML(str))

jest.mock('../../../common/data/hmppsAssessmentApi')
jest.mock('../../../common/utils/util')
jest.mock('../fields')

let req
const user = { token: 'mytoken', id: '1' }
const assessmentUuid = '22222222-2222-2222-2222-222222222221'
const episodeUuid = '22222222-2222-2222-2222-222222222222'

const controller = new SaveAndContinueController({
  route: 'test-route',
})

describe('SaveAndContinueController', () => {
  const mockSessionModel = (values = {}) => {
    req.sessionModel.get.mockImplementation(key => {
      switch (key) {
        case 'errors':
          return values.errors || []
        case 'answers':
          return values.answers || {}
        default:
          return undefined
      }
    })
  }

  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
    locals: {
      'csrf-token': 'CSRF_TOKEN',
    },
  }

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
        },
        values: {},
      },
    }

    res.render.mockReset()
    req.sessionModel.get.mockReset()
    req.sessionModel.set.mockReset()
    req.form.options.fields = {}
    req.form.options.allFields = {}

    getAnswers.mockReset()
    postAnswers.mockReset()
    getFlatAssessmentQuestions.mockReset()
    customValidations.mockReset()
    processReplacements.mockReset()

    processReplacements.mockImplementation(questions => questions)
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
      req.form.options.fields = {
        first_question: {
          questionCode: 'first_question',
          questionText: 'First Question',
          answerType: 'radio',
          answerSchemas: [
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

      mockSessionModel({
        answers: {
          first_question: 'YES',
        },
      })

      await controller.locals(req, res, () => {})

      const [yesAnswer] = res.locals.questions.first_question.answerSchemas
      expect(yesAnswer.conditional?.html).toBeDefined()
      // TODO: additional assertions
    })

    it('pre-renders nested conditional questions', async () => {
      req.form.options.fields = {
        first_question: {
          questionCode: 'first_question',
          questionText: 'First Question',
          answerType: 'radio',
          answerSchemas: [
            { value: 'YES', text: 'Yes' },
            { value: 'NO', text: 'No' },
          ],
          validate: [],
        },
        second_question: {
          questionCode: 'second_question',
          questionText: 'Second Question',
          answerType: 'radio',
          answerSchemas: [
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

      mockSessionModel({
        answers: {
          first_question: 'YES',
          second_question: 'NO',
        },
      })

      await controller.locals(req, res, () => {})

      const [yesAnswer] = res.locals.questions.first_question.answerSchemas
      expect(yesAnswer.conditional?.html).toBeDefined()
      // TODO: additional assertions
    })

    it('maps answers on to questions', async () => {
      req.form.options.fields = {
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
        answers: {
          first_question: 'FOO',
          second_question: 'BAR',
        },
      })

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
      })
    })

    it('prefers local answers to remote when mapping on to questions', async () => {
      req.form.options.fields = {
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
        answers: {
          first_question: 'SUBMITTED_FOO',
          second_question: 'SUBMITTED_BAR',
          third_question: '',
        },
      })

      getAnswers.mockResolvedValue({
        answers: {
          first_question: ['PREVIOUS_FOO'],
          second_question: ['PREVIOUS_BAR'],
          third_question: ['PREVIOUS_BAZ'],
        },
      })

      await controller.locals(req, res, () => {})

      expect(getAnswers).toHaveBeenCalledWith(req.session.assessment.uuid, 'current', req.user.token, req.user.id)

      expect(res.locals.questions).toEqual({
        first_question: {
          questionCode: 'first_question',
          answerType: 'numeric',
          answer: 'SUBMITTED_FOO',
        },
        second_question: {
          questionCode: 'second_question',
          answerType: 'numeric',
          answer: 'SUBMITTED_BAR',
        },
        third_question: {
          questionCode: 'third_question',
          answerType: 'numeric',
          answer: 'PREVIOUS_BAZ',
        },
      })
    })

    it('applies processReplacements for questions', async () => {
      await controller.locals(req, res, () => {})

      expect(processReplacements).toHaveBeenCalledWith(expect.anything(), req.session.assessment.subject)
    })

    it('stores questions in locals', async () => {
      req.form.options.fields = {
        date_first_sanction: {
          questionCode: 'date_first_sanction',
          answerType: 'date',
        },
      }

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
  })

  describe('configure', () => {
    it('combines remote and local field configurations', async () => {
      getFlatAssessmentQuestions.mockResolvedValue([
        { questionCode: 'age_first_conviction', questionText: 'Age at first sanction' },
      ])

      await controller.configure(req, res, () => {})

      expect(getFlatAssessmentQuestions).toHaveBeenCalledWith('RSR', user.token, user.id)
    })

    it('adds validation for mandatory questions if missing', async () => {
      getFlatAssessmentQuestions.mockResolvedValue([
        { questionCode: 'age_first_conviction', questionText: 'Age at first sanction' },
      ])

      await controller.configure(req, res, () => {})

      expect(getFlatAssessmentQuestions).toHaveBeenCalledWith('RSR', user.token, user.id)
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

      await controller.process(req, res, () => {})

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

      await controller.process(req, res, () => {})

      expect(req.form.values).toEqual({
        date_field: '',
      })

      expect(req.sessionModel.set).toHaveBeenCalledWith('answers', req.form.values)
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

      await controller.process(req, res, () => {})

      expect(req.form.values).toEqual({
        date_field: '',
      })

      expect(req.sessionModel.set).toHaveBeenCalledWith('answers', req.form.values)
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

      await controller.process(req, res, () => {})

      expect(req.form.values).toEqual({
        date_field: '',
      })

      expect(req.sessionModel.set).toHaveBeenCalledWith('answers', req.form.values)
    })
  })

  describe('validateFields', () => {
    it('applies customValidations', async () => {
      req.form.options.fields = {
        first_field: { answerType: 'numeric', questionCode: 'first_field', validation: [] },
        second_field: { answerType: 'numeric', questionCode: 'second_field', validation: [] },
        third_field: { answerType: 'date', questionCode: 'third_field', validation: [] },
      }

      const answers = {
        first_field: '2018-09-02',
        second_field: '3',
        third_field: '2',
        date_first_sanction: '17',
        total_sanctions: '1',
      }

      const modifiedFields = {
        first_field: { answerType: 'numeric', questionCode: 'first_field', validation: ['test'] },
        second_field: { answerType: 'numeric', questionCode: 'second_field', validation: ['test'] },
        third_field: { answerType: 'date', questionCode: 'third_field', validation: ['test'] },
      }

      mockSessionModel({ answers })
      customValidations.mockReturnValue(modifiedFields)

      const originalFieldConfiguration = JSON.parse(JSON.stringify(req.form.options.fields))

      await controller.validateFields(req, res, () => {})

      expect(req.sessionModel.get).toHaveBeenCalledWith('answers')
      expect(customValidations).toHaveBeenCalledWith(
        originalFieldConfiguration,
        req.session.assessment.subject.dob,
        answers.date_first_sanction,
        answers.total_sanctions,
      )
      expect(req.form.options.fields).toEqual(modifiedFields)
    })
  })

  describe('saveValues', () => {
    it('saves the answers', async () => {
      postAnswers.mockResolvedValue([true, { episodeUuid }])
      mockSessionModel({
        answers: {
          some_field: 'foo',
          some_selection_field: ['bar'],
        },
      })

      await controller.saveValues(req, res, () => {})

      expect(req.sessionModel.get).toHaveBeenCalledWith('answers')
      expect(postAnswers).toHaveBeenCalledWith(
        assessmentUuid,
        'current',
        {
          answers: {
            some_field: ['foo'],
            some_selection_field: ['bar'],
          },
        },
        user.token,
        user.id,
      )
    })

    it('renders an error when there are OASys validation errors', async () => {
      postAnswers.mockResolvedValue([
        false,
        {
          status: 422,
          reason: 'OASYS_VALIDATION',
          errors: [{ message: 'field error', key: 'some_field' }],
          pageErrors: ['server error'],
        },
      ])
      mockSessionModel()

      await controller.saveValues(req, res, () => {})

      const theError = 'Something went wrong'

      expect(req.sessionModel.get).toHaveBeenCalledWith('answers')
      expect(postAnswers).toHaveBeenCalledWith(assessmentUuid, 'current', { answers: {} }, user.token, user.id)
      expect(res.render).toHaveBeenCalledWith('app/error', { subHeading: theError })
    })

    it('renders an error when the user does not have permission to update the assessment', async () => {
      postAnswers.mockResolvedValue([false, { status: 403, reason: 'OASYS_PERMISSION' }])
      mockSessionModel()

      await controller.saveValues(req, res, () => {})

      const theError =
        'You do not have permission to update this type of assessment. Speak to your manager and ask them to request a change to your level of authorisation.'

      expect(req.sessionModel.get).toHaveBeenCalledWith('answers')
      expect(res.render).toHaveBeenCalledWith('app/error', { subHeading: theError })
    })

    it('displays an error if answer saving fails', async () => {
      const theError = new Error('Error message')
      postAnswers.mockRejectedValue(theError)
      mockSessionModel()

      await controller.saveValues(req, res, () => {})

      expect(res.render).toHaveBeenCalledWith(`app/error`, { error: theError })
    })
  })
})
