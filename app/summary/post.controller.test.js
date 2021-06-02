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
  })

  it('should render the page with the correct structure', async () => {
    postCompleteAssessment.mockResolvedValue([true, assessmentEpisodes])

    await completeAssessment(req, res)

    expect(res.render).toHaveBeenCalledWith(`${__dirname}/success`, { offenderName: 'Fred Smith' })
  })
})
