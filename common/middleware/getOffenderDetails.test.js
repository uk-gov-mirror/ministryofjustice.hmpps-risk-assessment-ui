const getOffenderDetails = require('./getOffenderDetails')
const { getOffenderData } = require('../data/assessmentApi')
const mockOffenderData = require('../../wiremock/responses/offenderDetails.json')
const {
  dev: { devAssessmentId },
} = require('../config')

jest.mock('../../common/data/assessmentApi')

describe('getOffenderDetails middleware', () => {
  let req
  let res
  const offenderData = mockOffenderData
  const next = jest.fn()
  const render = jest.fn()
  const tokens = {}
  beforeEach(() => {
    req = { tokens }
    res = { render, locals: {} }
    getOffenderData.mockResolvedValue(offenderData)
  })
  afterEach(() => {
    getOffenderData.mockReset()
    next.mockReset()
    render.mockReset()
  })
  describe('with complete data', () => {
    beforeEach(async () => {
      await getOffenderDetails(req, res, next)
    })
    it('should return an object with the required values', () => {
      expect(res.locals.offenderDetails).toEqual({
        age: '33',
        crn: 'J081276',
        dob: '1987-03-14',
        name: 'Garry Hart',
        pnc: '2012/123450000F',
      })
    })
    it('should call the data service once and pass the id', () => {
      expect(getOffenderData).toHaveBeenCalledTimes(1)
      expect(getOffenderData).toHaveBeenCalledWith(devAssessmentId, tokens)
    })
    it('should call the next function', () => {
      expect(next).toHaveBeenCalledTimes(1)
      expect(render).not.toHaveBeenCalled()
    })
  })
  describe('without certain required data', () => {
    beforeEach(async () => {
      delete offenderData.name
      await getOffenderDetails(req, res, next)
    })
    it('should render the error page', async () => {
      expect(next).not.toHaveBeenCalled()
      expect(render).toHaveBeenCalledWith(`app/error`, {
        error: new Error('Required offender details could not be found'),
      })
    })
  })
})
