const { Controller } = require('hmpo-form-wizard')

const StartUnpaidWork = require('./start')

const controller = new StartUnpaidWork({
  route: 'test-route',
})

const { assessmentSupervision, getCurrentEpisode } = require('../../../common/data/hmppsAssessmentApi')

jest.mock('../../../common/data/hmppsAssessmentApi', () => ({
  getCurrentEpisode: jest.fn(),
  assessmentSupervision: jest.fn(),
}))

jest.mock('../../../common/data/hmppsAssessmentApi')

describe('startController', () => {
  describe('saveValues', () => {
    const superMethod = jest.spyOn(Controller.prototype, 'saveValues')

    let req
    const user = { token: 'USER_TOKEN', id: '1' }
    const assessmentUuid = '22222222-2222-2222-2222-222222222221'
    const episodeUuid = '22222222-2222-2222-2222-222222222222'

    const res = {
      redirect: jest.fn(),
      render: jest.fn(),
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
            eventId: '12345',
            assessmentCode: 'A12345',
            deliusEventType: 'A',
            uuid: assessmentUuid,
            episodeUuid,
            subject: { dob: '1980-01-01', crn: 'CRN1234567', existingSubjectParam: 'abc' },
          },
          save: jest.fn(),
        },
      }

      res.render.mockReset()
      req.sessionModel.get.mockReset()
      req.sessionModel.set.mockReset()
      superMethod.mockReset()
      req.session.save.mockReset()
    })

    it('calls create assessment create endpoint', async () => {
      const offenceCode = '00'
      const codeDescription = 'Offence'
      const offenceSubCode = '00'
      const subCodeDescription = 'Sub Offence'
      const subject = {
        name: 'Test Offender',
        dateOfBirth: '1980-01-01',
        pnc: 'PNC1234567',
        crn: 'CRN1234567',
        subjectUuid: 'SUBJECT_UUID',
      }
      assessmentSupervision.mockResolvedValue([true, { assessmentUuid, subject }])
      getCurrentEpisode.mockResolvedValue({
        episodeUuid,
        offence: {
          offenceCode,
          codeDescription,
          offenceSubCode,
          subCodeDescription,
          sentenceDate: '2020-01-01',
        },
      })

      await controller.saveValues(req, res, next)

      expect(assessmentSupervision).toHaveBeenCalledWith(
        {
          assessmentSchemaCode: 'A12345',
          crn: 'CRN1234567',
          deliusEventId: '12345',
          deliusEventType: 'A',
        },
        'USER_TOKEN',
        '1',
      )
    })

    it('updates assessment with returned supervision information', async () => {
      const offenceCode = '00'
      const codeDescription = 'Offence'
      const offenceSubCode = '00'
      const subCodeDescription = 'Sub Offence'
      const subject = {
        name: 'Test Offender',
        dateOfBirth: '1980-04-01',
        pnc: 'PNC1234567',
        crn: 'CRN1234567',
        subjectUuid: 'SUBJECT_UUID',
      }
      assessmentSupervision.mockResolvedValue([true, { assessmentUuid, subject }])
      getCurrentEpisode.mockResolvedValue({
        episodeUuid,
        userFullName: 'Test User',
        lastEditedDate: '2020-01-01T07:30:00.000000',
        offence: {
          offenceCode,
          codeDescription,
          offenceSubCode,
          subCodeDescription,
          sentenceDate: '2020-01-01',
        },
      })

      await controller.saveValues(req, res, next)

      expect(req.session.assessment).toEqual({
        assessmentCode: 'A12345',
        deliusEventType: 'A',
        episodeUuid,
        eventId: '12345',
        lastEditedBy: 'Test User',
        lastEditedDate: '2020-01-01T07:30:00.000000',
        subject: {
          age: 42,
          dob: '1980-04-01',
          crn: 'CRN1234567',
          existingSubjectParam: 'abc',
          name: 'Test Offender',
          pnc: 'PNC1234567',
          subjectUuid: 'SUBJECT_UUID',
        },
        uuid: '22222222-2222-2222-2222-222222222221',
      })
    })

    it('returns an error when unable to create an assessment', async () => {
      assessmentSupervision.mockResolvedValue([false, { reason: 'SOME_ERROR' }])

      await controller.saveValues(req, res, next)

      expect(res.render).toHaveBeenCalledWith('app/error', { subHeading: 'Something went wrong' })
    })
  })
})
