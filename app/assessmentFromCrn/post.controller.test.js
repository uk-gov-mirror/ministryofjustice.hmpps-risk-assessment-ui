const { startAssessmentFromCrn, startAssessmentFromForm } = require('./post.controller')
const { assessmentSupervision } = require('../../common/data/hmppsAssessmentApi')

jest.mock('../../common/data/hmppsAssessmentApi', () => ({
  assessmentSupervision: jest.fn(),
}))

describe('POST: Start an assessment', () => {
  const user = {
    id: 1,
    areaName: 'USER_AREA',
    token: 'USER_TOKEN',
  }

  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  }

  describe('from CRN', () => {
    beforeEach(() => {
      assessmentSupervision.mockReset()
      res.redirect.mockReset()
      res.render.mockReset()
    })

    it('redirects on success', async () => {
      const req = {
        params: {
          crn: 'CRN',
          deliusEventId: 'DELIUS_EVENT_ID',
          assessmentType: 'ASSESSMENT_TYPE',
        },
        user,
      }

      const apiResponse = [true, { assessmentUuid: 'ASSESSMENT_UUID' }]

      assessmentSupervision.mockResolvedValue(apiResponse)

      await startAssessmentFromCrn(req, res)

      expect(res.redirect).toHaveBeenCalledWith('/ASSESSMENT_UUID/questionGroup/pre_sentence_assessment/summary')
    })

    it('renders an error when the user does not have permission', async () => {
      const req = {
        params: {
          crn: 'CRN',
          deliusEventId: 'DELIUS_EVENT_ID',
          assessmentType: 'ASSESSMENT_TYPE',
        },
        user,
      }

      const apiResponse = [false, { status: 403, reason: 'OASYS_PERMISSION' }]

      assessmentSupervision.mockResolvedValue(apiResponse)

      await startAssessmentFromCrn(req, res)

      const theError =
        'You do not have permission to create this type of assessment. Speak to your manager and ask them to request a change to your level of authorisation.'

      expect(res.render).toHaveBeenCalledWith('app/error', { subHeading: theError })
    })

    it('renders an error when attempting to create a duplicate assessment', async () => {
      const req = {
        params: {
          crn: 'CRN',
          deliusEventId: 'DELIUS_EVENT_ID',
          assessmentType: 'ASSESSMENT_TYPE',
        },
        user,
      }

      const apiResponse = [
        false,
        {
          status: 400,
          reason: 'DUPLICATE_OFFENDER_RECORD',
        },
      ]

      assessmentSupervision.mockResolvedValue(apiResponse)

      await startAssessmentFromCrn(req, res)

      const theError =
        'The offender is showing as a possible duplicate record under USER_AREA. Log into OASys to manage the duplication. If you need help, contact the OASys Application Support team'

      expect(res.render).toHaveBeenCalledWith('app/error', { subHeading: theError })
    })
  })

  describe('from form', () => {
    beforeEach(() => {
      assessmentSupervision.mockReset()
      res.redirect.mockReset()
      res.render.mockReset()
    })

    it('redirects on success', async () => {
      const req = {
        body: {
          crn: 'CRN',
          deliusEventId: 'DELIUS_EVENT_ID',
          assessmentType: 'ASSESSMENT_TYPE',
        },
        user,
      }

      const apiResponse = [true, { assessmentUuid: 'ASSESSMENT_UUID' }]

      assessmentSupervision.mockResolvedValue(apiResponse)

      await startAssessmentFromForm(req, res)

      expect(res.redirect).toHaveBeenCalledWith('/ASSESSMENT_UUID/questionGroup/pre_sentence_assessment/summary')
    })

    it('renders an error when the user does not have permission', async () => {
      const req = {
        body: {
          crn: 'CRN',
          deliusEventId: 'DELIUS_EVENT_ID',
          assessmentType: 'ASSESSMENT_TYPE',
        },
        user,
      }

      const apiResponse = [false, { status: 403, reason: 'OASYS_PERMISSION' }]

      assessmentSupervision.mockResolvedValue(apiResponse)

      await startAssessmentFromForm(req, res)

      const theError =
        'You do not have permission to create this type of assessment. Speak to your manager and ask them to request a change to your level of authorisation.'

      expect(res.render).toHaveBeenCalledWith('app/error', { subHeading: theError })
    })

    it('renders an error when attempting to create a duplicate assessment', async () => {
      const req = {
        body: {
          crn: 'CRN',
          deliusEventId: 'DELIUS_EVENT_ID',
          assessmentType: 'ASSESSMENT_TYPE',
        },
        user,
      }

      const apiResponse = [
        false,
        {
          status: 400,
          reason: 'DUPLICATE_OFFENDER_RECORD',
        },
      ]

      assessmentSupervision.mockResolvedValue(apiResponse)

      await startAssessmentFromForm(req, res)

      const theError =
        'The offender is showing as a possible duplicate record under USER_AREA. Log into OASys to manage the duplication. If you need help, contact the OASys Application Support team'

      expect(res.render).toHaveBeenCalledWith('app/error', { subHeading: theError })
    })
  })
})
