// @ts-check

const { logger } = require('../../common/logging/logger')
const { getAssessmentSummary } = require('../../common/data/hmppsAssessmentApi')
const { processReplacements } = require('../../common/utils/util')

const displayOverview = async (
  { params: { assessmentId, assessmentType }, errors = {}, errorSummary = null, user },
  res,
) => {
  try {
    let assessment = await grabAssessmentSummary(assessmentType, user?.token, user?.id)

    assessment = processReplacements(assessment, res.locals.offenderDetails)

    const summary = {
      sections: [],
    }

    assessment.contents?.forEach((section, sectionIndex) => {
      const sectionContents = {
        heading: {
          text: section.title,
        },
        items: [],
      }
      section.contents?.forEach((item, index) => {
        const href = `/${assessmentId}/questiongroup/${assessmentType}/${sectionIndex}/${index}`
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
      groupId: assessmentType,
    })
  } catch (error) {
    return res.render('app/error', { error })
  }
}

const grabAssessmentSummary = (assessmentType, token, userId) => {
  try {
    return getAssessmentSummary(assessmentType, token, userId)
  } catch (error) {
    logger.error(`Could not retrieve assessment summary for ${assessmentType}, error: ${error}`)
    throw error
  }
}

module.exports = {
  displayOverview,
}
