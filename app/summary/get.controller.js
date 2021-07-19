// @ts-check

const { logger } = require('../../common/logging/logger')
const { getAssessmentSummary } = require('../../common/data/hmppsAssessmentApi')
const { processReplacements } = require('../../common/utils/util')

const displayOverview = async (
  { params: { assessmentId, assessmentSchemaCode }, errors = {}, errorSummary = null, user },
  res,
) => {
  try {
    let assessment = await grabAssessmentSummary(assessmentSchemaCode, user?.token, user?.id)

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
        const href = `/${assessmentId}/questiongroup/${assessmentSchemaCode}/${sectionIndex}/${index}`
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
      groupId: assessmentSchemaCode,
    })
  } catch (error) {
    return res.render('app/error', { error })
  }
}

const grabAssessmentSummary = (assessmentSchemaCode, token, userId) => {
  try {
    return getAssessmentSummary(assessmentSchemaCode, token, userId)
  } catch (error) {
    logger.error(`Could not retrieve assessment summary for ${assessmentSchemaCode}, error: ${error}`)
    throw error
  }
}

module.exports = {
  displayOverview,
}
