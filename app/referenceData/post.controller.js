const { getFilteredReferenceData } = require('../../common/data/hmppsAssessmentApi')

const fetchFilteredReferenceData = async (req, res) => {
  try {
    const {
      params: { assessmentUuid, episodeUuid },
      body,
      tokens,
    } = req
    const { questionUuid, targetValues } = body

    // eslint-disable-next-line no-unused-vars
    const [_, response] = await getFilteredReferenceData(
      assessmentUuid,
      episodeUuid,
      questionUuid,
      targetValues,
      tokens,
    )

    return res.json(response.map(({ description, code }) => ({ text: description, value: code })))
  } catch (error) {
    return res.status(error.response.status).send()
  }
}

module.exports = { fetchFilteredReferenceData }
