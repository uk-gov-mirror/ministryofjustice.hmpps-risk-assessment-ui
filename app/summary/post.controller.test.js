// Initialise nunjucks environment
const { completeAssessment } = require('./post.controller')
const { postCompleteAssessment } = require('../../common/data/hmppsAssessmentApi')
const assessmentEpisodesJson = require('../../wiremock/responses/assessmentEpisodes.json')

jest.mock('../../common/data/hmppsAssessmentApi')

const user = { token: 'mytoken', id: '1' }
let assessmentEpisodes

describe('display complete assessment page', () => {
  const req = {
    body: {},
    user,
    params: {
      assessmentId: 'test-assessment-id',
    },
  }
  const res = {
    render: jest.fn(),
    redirect: jest.fn(),
    locals: {
      offenderDetails: {
        name: 'Fred Smith',
      },
    },
  }

  beforeEach(() => {
    assessmentEpisodes = JSON.parse(JSON.stringify(assessmentEpisodesJson))
    postCompleteAssessment.mockReset()
    res.render.mockReset()
  })

  it('should render the page with the correct structure', async () => {
    postCompleteAssessment.mockResolvedValue([true, assessmentEpisodes])

    await completeAssessment(req, res)

    expect(res.render).toHaveBeenCalledWith(`${__dirname}/success`, { offenderName: 'Fred Smith' })
  })

  it('renders an error when the user does not have permission to update the assessment', async () => {
    postCompleteAssessment.mockResolvedValue([false, { status: 403, reason: 'OASYS_PERMISSION' }])

    await completeAssessment(req, res)

    const theError =
      'You do not have permission to complete this type of assessment. Speak to your manager and ask them to request a change to your level of authorisation.'

    expect(res.render).toHaveBeenCalledWith('app/error', { subHeading: theError })
  })
})
