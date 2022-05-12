const getQuestion = require('./getQuestionGroup')
const { getAssessmentQuestions } = require('../../data/hmppsAssessmentApi')
const { getApiToken } = require('../../data/oauth')
const { getReferenceDataListByCategory } = require('../../data/offenderAssessmentApi')
const { processReplacements } = require('../../utils/util')
const {
  dev: { devAssessmentId },
} = require('../../config')

jest.mock('../../data/oauth', () => ({
  getApiToken: jest.fn(),
}))

const questions = {
  type: 'group',
  groupId: '111',
  title: 'assessment root',
  contents: [
    {
      type: 'group',
      groupId: '111_1',
      title: 'section 1',
      contents: [
        {
          type: 'group',
          groupId: '111_1_1',
          title: 'page 1',
          contents: [],
        },
        {
          type: 'group',
          groupId: '111_1_2',
          title: 'page 2',
          contents: [],
        },
      ],
    },
    {
      type: 'group',
      groupId: '111_2',
      title: 'section 2',
      contents: [
        {
          type: 'group',
          groupId: '111_2_1',
          title: 'page 3',
          contents: [],
        },
        {
          type: 'group',
          groupId: '111_2_2',
          title: 'page 4',
          contents: [],
        },
        {
          type: 'group',
          groupId: '111_2_3',
          title: 'page 5',
          contents: [],
        },
      ],
    },
  ],
}

jest.mock('../../data/hmppsAssessmentApi')
jest.mock('../../data/offenderAssessmentApi')
jest.mock('../../utils/util')

processReplacements.mockImplementation(input => input)

describe('getQuestionGroup middleware', () => {
  let req
  let res
  const questionData = questions
  const next = jest.fn()
  const render = jest.fn()
  const user = {}
  beforeEach(() => {
    req = {
      params: {
        groupId: devAssessmentId,
        subgroup: 0,
        page: 0,
      },
      user,
    }
    res = { render, locals: {} }
    getAssessmentQuestions.mockResolvedValue(questionData)
  })
  afterEach(() => {
    getAssessmentQuestions.mockReset()
    getReferenceDataListByCategory.mockReset()
    next.mockReset()
    render.mockReset()
  })
  describe('with complete data', () => {
    beforeEach(async () => {
      await getQuestion(req, res, next)
    })
    it('should return a question object with the required values', () => {
      expect(res.locals.questionGroup).toEqual({
        contents: [],
        groupId: '111_1_1',
        title: 'page 1',
        type: 'group',
      })
    })
    it('should call the data service once and pass the id', () => {
      expect(getAssessmentQuestions).toHaveBeenCalledTimes(1)
      expect(getAssessmentQuestions).toHaveBeenCalledWith(devAssessmentId, user.token, user.id)
    })
    it('should call the next function', () => {
      expect(next).toHaveBeenCalledTimes(1)
      expect(render).not.toHaveBeenCalled()
    })
  })

  describe('calculates navigation details', () => {
    it('calculates for first page', async () => {
      req = {
        params: {
          groupId: devAssessmentId,
          subgroup: 0,
          page: 0,
        },
      }
      await getQuestion(req, res, next)
      expect(res.locals.navigation).toEqual({
        next: {
          name: 'page 2',
          url: 'fb6b7c33-07fc-4c4c-a009-8d60f66952c4/0/1',
        },
        parent: 'section 1',
        previous: {
          name: 'Assessment progress',
          url: 'fb6b7c33-07fc-4c4c-a009-8d60f66952c4/summary',
        },
      })
    })

    it('calculates for end of section', async () => {
      req = {
        params: {
          groupId: devAssessmentId,
          subgroup: 0,
          page: 1,
        },
      }
      await getQuestion(req, res, next)
      expect(res.locals.navigation).toEqual({
        next: {
          name: 'page 3',
          url: 'fb6b7c33-07fc-4c4c-a009-8d60f66952c4/1/0',
        },
        parent: 'section 1',
        previous: {
          name: 'page 1',
          url: 'fb6b7c33-07fc-4c4c-a009-8d60f66952c4/0/0',
        },
      })
    })

    it('calculates for start of section', async () => {
      req = {
        params: {
          groupId: devAssessmentId,
          subgroup: 1,
          page: 0,
        },
      }
      await getQuestion(req, res, next)
      expect(res.locals.navigation).toEqual({
        next: {
          name: 'page 4',
          url: 'fb6b7c33-07fc-4c4c-a009-8d60f66952c4/1/1',
        },
        parent: 'section 2',
        previous: {
          name: 'page 2',
          url: 'fb6b7c33-07fc-4c4c-a009-8d60f66952c4/0/1',
        },
      })
    })

    it('calculates for final page of assessment', async () => {
      req = {
        params: {
          groupId: devAssessmentId,
          subgroup: 1,
          page: 2,
        },
      }
      await getQuestion(req, res, next)
      expect(res.locals.navigation).toEqual({
        next: {
          name: 'Assessment progress',
          url: 'fb6b7c33-07fc-4c4c-a009-8d60f66952c4/summary',
        },
        parent: 'section 2',
        previous: {
          name: 'page 4',
          url: 'fb6b7c33-07fc-4c4c-a009-8d60f66952c4/1/1',
        },
      })
    })
  })

  describe('applies static reference data to questions', () => {
    beforeEach(async () => {
      getReferenceDataListByCategory.mockResolvedValue([{ description: 'foo', code: 'bar' }])
      getApiToken.mockResolvedValue('API_TOKEN')
    })

    it('fetches data for questions that have a reference data category', async () => {
      const questionsWithReferenceDataCategories = {
        type: 'group',
        groupId: '111',
        title: 'assessment root',
        contents: [
          {
            type: 'group',
            groupId: '111_1',
            title: 'section 1',
            contents: [
              {
                type: 'group',
                groupId: '111_1_1',
                title: 'page 1',
                contents: [
                  {
                    type: 'question',
                    questionText: 'Test Question',
                    referenceDataCategory: 'REFERENCE_DATA_CATEGORY_1',
                  },
                  {
                    type: 'question',
                    questionText: 'Test Question',
                    referenceDataCategory: 'REFERENCE_DATA_CATEGORY_2',
                  },
                ],
              },
            ],
          },
        ],
      }

      getAssessmentQuestions.mockResolvedValue(questionsWithReferenceDataCategories)

      await getQuestion(req, res, next)

      expect(getReferenceDataListByCategory).toHaveBeenCalledWith('REFERENCE_DATA_CATEGORY_1', 'API_TOKEN')
      expect(getReferenceDataListByCategory).toHaveBeenCalledWith('REFERENCE_DATA_CATEGORY_2', 'API_TOKEN')

      expect(res.locals.questionGroup.contents[0]).toMatchObject({
        type: 'question',
        questionText: 'Test Question',
        referenceDataCategory: 'REFERENCE_DATA_CATEGORY_1',
        answerDtos: [{ text: 'foo', value: 'bar' }],
      })
    })

    it('does not alter questions without a reference data category', async () => {
      const questionsWithoutReferenceDataCategories = {
        type: 'group',
        groupId: '111',
        title: 'assessment root',
        contents: [
          {
            type: 'group',
            groupId: '111_1',
            title: 'section 1',
            contents: [
              {
                type: 'group',
                groupId: '111_1_1',
                title: 'page 1',
                contents: [
                  {
                    type: 'question',
                    questionText: 'Test Question',
                    answerDtos: [{ text: 'Should not have altered...', value: '...hopefully' }],
                  },
                ],
              },
            ],
          },
        ],
      }

      getAssessmentQuestions.mockResolvedValue(questionsWithoutReferenceDataCategories)

      await getQuestion(req, res, next)

      expect(getReferenceDataListByCategory).not.toHaveBeenCalled()
      expect(res.locals.questionGroup.contents[0]).toMatchObject({
        type: 'question',
        questionText: 'Test Question',
        answerDtos: [{ text: 'Should not have altered...', value: '...hopefully' }],
      })
    })

    it('fetches each list only once', async () => {
      const questionsWithMultipleReferenceDataCategories = {
        type: 'group',
        groupId: '111',
        title: 'assessment root',
        contents: [
          {
            type: 'group',
            groupId: '111_1',
            title: 'section 1',
            contents: [
              {
                type: 'group',
                groupId: '111_1_1',
                title: 'page 1',
                contents: [
                  {
                    type: 'question',
                    questionText: 'Test Question 2',
                    referenceDataCategory: 'REFERENCE_DATA_CATEGORY_1',
                  },
                  {
                    type: 'question',
                    questionText: 'Test Question 2',
                    referenceDataCategory: 'REFERENCE_DATA_CATEGORY_1',
                  },
                ],
              },
            ],
          },
        ],
      }

      getAssessmentQuestions.mockResolvedValue(questionsWithMultipleReferenceDataCategories)

      await getQuestion(req, res, next)

      expect(getReferenceDataListByCategory).toHaveBeenCalledTimes(1)
    })
  })

  describe('creates attributes for filtered reference data', () => {
    const questionSchema = {
      type: 'group',
      groupId: '111',
      title: 'assessment root',
      contents: [
        {
          type: 'group',
          groupId: '111_1',
          title: 'section 1',
          contents: [
            {
              type: 'group',
              groupId: '111_1_1',
              title: 'page 1',
              contents: [
                {
                  type: 'question',
                  answerType: 'radio',
                  questionId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
                  questionCode: 'test_question',
                  questionText: 'Test Question',
                  referenceDataCategory: 'FILTERED_REFERENCE_DATA',
                  referenceDataTargets: [
                    {
                      questionCode: 'test_question',
                      isRequired: false,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }

    it('adds a data attribute with the question UUID', async () => {
      getAssessmentQuestions.mockResolvedValue(questionSchema)

      await getQuestion(req, res, next)

      expect(res.locals.questionGroup.contents[0]).toMatchObject({
        type: 'question',
        questionText: 'Test Question',
        attributes: { 'data-question-code': 'test_question' },
      })
    })

    it('adds a data attribute with the question type', async () => {
      getAssessmentQuestions.mockResolvedValue(questionSchema)

      await getQuestion(req, res, next)

      expect(res.locals.questionGroup.contents[0]).toMatchObject({
        type: 'question',
        questionText: 'Test Question',
        attributes: { 'data-question-type': 'radio' },
      })
    })

    it('adds a data attribute for reference data target fields', async () => {
      getAssessmentQuestions.mockResolvedValue(questionSchema)

      await getQuestion(req, res, next)

      expect(res.locals.questionGroup.contents[0]).toMatchObject({
        type: 'question',
        questionText: 'Test Question',
        attributes: {
          'data-reference-data-targets': '[{"questionCode":"test_question","isRequired":false}]',
        },
      })
    })

    it('does not add a data attribute for reference data target fields when not present', async () => {
      getAssessmentQuestions.mockResolvedValue({
        type: 'group',
        groupId: '111',
        title: 'assessment root',
        contents: [
          {
            type: 'group',
            groupId: '111_1',
            title: 'section 1',
            contents: [
              {
                type: 'group',
                groupId: '111_1_1',
                title: 'page 1',
                contents: [
                  {
                    type: 'question',
                    questionId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
                    questionText: 'Test Question',
                  },
                ],
              },
            ],
          },
        ],
      })

      await getQuestion(req, res, next)

      expect(res.locals.questionGroup.contents[0].attributes).not.toHaveProperty('data-reference-data-target')
    })
  })
})
