const { Controller } = require('hmpo-form-wizard')

const CloseAssessmentController = require('./closeAssessment')
const hmppsAssessmentsApiClient = require('../../../common/data/hmppsAssessmentApi')

jest.mock('../../../common/data/hmppsAssessmentApi')
jest.mock('../../../common/utils/util', () => ({
  getCorrelationId: jest.fn(() => 'mocked-correlation-id'),
}))
jest.mock('../../../common/data/userDetailsCache', () => ({
  getCachedUserDetails: jest.fn(() => ({
    isActive: true,
    oasysUserCode: 'SUPPORT1',
    username: 'Ray Arnold',
    email: 'foo@bar.baz',
    areaCode: 'HFS',
    areaName: 'Hertfordshire',
  })),
}))

describe('CloseAssessmentController', () => {
  describe('Render', () => {
    const superMethod = jest.spyOn(Controller.prototype, 'render')
    const controller = new CloseAssessmentController({
      route: 'test-route',
    })

    let req
    const user = { token: 'mytoken', id: '1' }
    const assessmentUuid = '22222222-2222-2222-2222-222222222221'
    const episodeUuid = '22222222-2222-2222-2222-222222222222'

    const res = {
      redirect: jest.fn(),
      render: jest.fn(),
      send: jest.fn(),
      set: jest.fn(),
      locals: {
        'csrf-token': 'CSRF_TOKEN',
        persistedAnswers: {
          first_name: 'Robert',
          last_name: 'Robertson',
          crn: 'X123456',
        },
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
          save: jest.fn(),
        },
        form: {
          options: {
            allFields: {},
            fields: {},
            journeyName: 'UPW',
          },
          values: {},
        },
      }

      res.render.mockReset()
      res.send.mockReset()
      res.set.mockReset()
      req.sessionModel.get.mockReset()
      req.sessionModel.set.mockReset()
      req.form.options.fields = {}
      req.form.options.allFields = {}
      next.mockReset()
      hmppsAssessmentsApiClient.closeAssessment.mockReset()
      superMethod.mockReset()
      req.session.save.mockReset()
    })

    it('closes an assessment', async () => {
      hmppsAssessmentsApiClient.closeAssessment.mockResolvedValue([true])

      await controller.render(req, res, next)

      expect(hmppsAssessmentsApiClient.closeAssessment).toHaveBeenCalledWith(assessmentUuid, episodeUuid, user)
      expect(superMethod).toHaveBeenCalled()
    })

    it('removes the assessment from session', async () => {
      hmppsAssessmentsApiClient.closeAssessment.mockResolvedValue([true])

      await controller.render(req, res, next)

      expect(req.session.assessment).toBeUndefined()
      expect(req.session.save).toHaveBeenCalled()
      expect(superMethod).toHaveBeenCalled()
    })

    it('passes an error to the error handler when unable to close the assessment', async () => {
      hmppsAssessmentsApiClient.closeAssessment.mockResolvedValue([false])

      await controller.render(req, res, next)

      expect(next).toHaveBeenCalledWith(new Error('Failed to close the assessment'))
    })
  })
})
