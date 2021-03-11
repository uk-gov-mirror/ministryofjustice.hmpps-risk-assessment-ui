// @ts-check

const { logger } = require('../../common/logging/logger')
const { getQuestionGroupSummary } = require('../../common/data/assessmentApi')
const { processReplacements } = require('../../common/utils/util')

const displayQuestionGroupSummary = async (
  { params: { assessmentId, groupId }, errors = {}, errorSummary = null, tokens },
  res,
) => {
  try {
    let assessment = await grabQuestionGroupSummary(groupId, tokens)

    assessment = processReplacements(assessment, res.locals.offenderDetails)

    const summary = {
      sections: [],
    }

    assessment.contents?.forEach(section => {
      const sectionContents = {
        heading: {
          text: section.title,
        },
        items: [],
      }
      section.contents?.forEach((item, index) => {
        const href = `/${assessmentId}/questionGroup/${item.groupId}/${index}`
        const newItem = {
          text: item.title,
          href,
          status: item.status,
        }
        sectionContents.items.push(newItem)
      })

      summary.sections.push(sectionContents)
    })

    return res.render(`${__dirname}/index`, {
      assessmentId,
      summary,
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
