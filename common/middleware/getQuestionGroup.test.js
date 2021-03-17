const getQuestion = require('./getQuestionGroup')
const { getQuestionGroup } = require('../data/assessmentApi')
const { processReplacements } = require('../utils/util')
const {
  dev: { devAssessmentId },
} = require('../config')

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

jest.mock('../../common/data/assessmentApi')
jest.mock('../utils/util')

processReplacements.mockImplementation(input => input)

describe('getQuestionGroup middleware', () => {
  let req
  let res
  const questionData = questions
  const next = jest.fn()
  const render = jest.fn()
  const tokens = {}
  beforeEach(() => {
    req = {
      params: {
        groupId: devAssessmentId,
        subgroup: 0,
        page: 0,
      },
      tokens,
    }
    res = { render, locals: {} }
    getQuestionGroup.mockResolvedValue(questionData)
  })
  afterEach(() => {
    getQuestionGroup.mockReset()
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
      expect(getQuestionGroup).toHaveBeenCalledTimes(1)
      expect(getQuestionGroup).toHaveBeenCalledWith(devAssessmentId, tokens)
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
          url: 'e69a61ff-7395-4a12-b434-b1aa6478aded/0/1',
        },
        parent: 'section 1',
        previous: {
          name: 'Assessment progress',
          url: 'e69a61ff-7395-4a12-b434-b1aa6478aded/summary',
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
          url: 'e69a61ff-7395-4a12-b434-b1aa6478aded/1/0',
        },
        parent: 'section 1',
        previous: {
          name: 'page 1',
          url: 'e69a61ff-7395-4a12-b434-b1aa6478aded/0/0',
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
          url: 'e69a61ff-7395-4a12-b434-b1aa6478aded/1/1',
        },
        parent: 'section 2',
        previous: {
          name: 'page 2',
          url: 'e69a61ff-7395-4a12-b434-b1aa6478aded/0/1',
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
          url: 'e69a61ff-7395-4a12-b434-b1aa6478aded/summary',
        },
        parent: 'section 2',
        previous: {
          name: 'page 4',
          url: 'e69a61ff-7395-4a12-b434-b1aa6478aded/1/1',
        },
      })
    })
  })
})
