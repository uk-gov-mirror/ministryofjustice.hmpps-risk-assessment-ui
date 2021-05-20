const { getFilteredReferenceData } = require('../../common/data/hmppsAssessmentApi')

const fetchFilteredReferenceData = async (req, res) => {
  try {
    const {
      params: { assessmentId, episodeId },
      body,
      user,
    } = req
    const { questionUuid, targetValues } = body

    // eslint-disable-next-line no-unused-vars
    const [_, response] = await getFilteredReferenceData(
      assessmentId,
      episodeId,
      questionUuid,
      targetValues,
      user?.token,
    )

    return res.json(
      Object.values(response)
        .flat()
        .map(({ description, code }) => ({ text: description, value: code })),
    )
  } catch (error) {
    return res.status(error.response?.status || 500).send()
  }
}

module.exports = { fetchFilteredReferenceData }
