// @ts-check

const { logger } = require('../../common/logging/logger')
const { getQuestionGroupSummary } = require('../../common/data/assessmentApi')

const displayQuestionGroupSummary = async (
  { params: { assessmentId, groupId }, errors = {}, errorSummary = null, tokens },
  res,
) => {
  try {
    const assessment = await grabQuestionGroupSummary(groupId, tokens)

    const overview = {
      sections: [],
    }

    const sectionContents = {
      heading: {
        text: assessment.title,
      },
      items: [],
    }

    assessment.contents?.forEach((item, index) => {
      const href = `/${assessmentId}/questionGroup/${groupId}/${index}`
      const newItem = {
        text: item.title,
        href,
        status: item.status,
      }
      sectionContents.items.push(newItem)
    })

    overview.sections.push(sectionContents)

    return res.render(`${__dirname}/index`, {
      assessmentId,
      overview,
      subheading: assessment.title,
      groupId,
    })
  } catch (error) {
    return res.render('app/error', { error })
  }
}

const grabQuestionGroupSummary = (groupId, tokens) => {
  try {
    return getQuestionGroupSummary(groupId, tokens)
  } catch (error) {
    logger.error(`Could not retrieve question group summary for ${groupId}, error: ${error}`)
    throw error
  }
}

module.exports = {
  displayOverview: displayQuestionGroupSummary,
}
