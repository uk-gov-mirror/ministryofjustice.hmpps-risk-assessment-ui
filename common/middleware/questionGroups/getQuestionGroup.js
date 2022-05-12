// @ts-check
const logger = require('../../logging/logger')
const { getAssessmentQuestions } = require('../../data/hmppsAssessmentApi')
const { getApiToken } = require('../../data/oauth')
const { getReferenceDataListByCategory } = require('../../data/offenderAssessmentApi')
const { processReplacements } = require('../../utils/util')

const findNext = (questionGroups, groupId, section, page) => {
  const nextPage = parseInt(page, 10) + 1
  const nextSection = parseInt(section, 10) + 1
  let url
  let name

  if (questionGroups.contents[section].contents[nextPage]) {
    // there is a next page in this section
    url = `${groupId}/${section}/${nextPage}`
    name = questionGroups.contents[section].contents[nextPage].title
  } else if (questionGroups.contents[nextSection]?.contents[0]) {
    // no further pages - but there is a next section
    url = `${groupId}/${nextSection}/0`
    name = questionGroups.contents[nextSection].contents[0].title
  } else {
    // no next page or section - back to summary screen
    url = `${groupId}/summary`
    name = 'Assessment progress'
  }

  return { url, name }
}

const findPrevious = (questionGroups, groupId, section, page) => {
  const previousPage = parseInt(page, 10) - 1
  const previousSection = parseInt(section, 10) - 1
  let url
  let name

  if (questionGroups.contents[section].contents[previousPage]) {
    // there is a previous page in this section
    url = `${groupId}/${section}/${previousPage}`
    name = questionGroups.contents[section].contents[previousPage].title
  } else if (questionGroups.contents[previousSection]?.contents[0]) {
    // no previous page - but there is a previous section
    const lastPageOfPreviousSection = questionGroups.contents[previousSection].contents.length - 1
    url = `${groupId}/${previousSection}/${lastPageOfPreviousSection}`
    name = questionGroups.contents[previousSection].contents[lastPageOfPreviousSection].title
  } else {
    // no previous page or section - back to summary screen
    url = `${groupId}/summary`
    name = 'Assessment progress'
  }

  return { url, name }
}

const findParent = (questionGroups, section) => {
  return questionGroups.contents[section].title
}

const usesStaticReferenceData = questionSchema =>
  questionSchema.referenceDataCategory && questionSchema.referenceDataCategory !== 'FILTERED_REFERENCE_DATA'
const usesDynamicReferenceData = questionSchema =>
  questionSchema.referenceDataCategory && questionSchema.referenceDataCategory === 'FILTERED_REFERENCE_DATA'

const applyStaticReferenceData = async questionResponse => {
  const extractReferenceDataCategories = questionSchema => {
    if (questionSchema.type === 'group') {
      return questionSchema.contents.flatMap(extractReferenceDataCategories)
    }
    if (usesStaticReferenceData(questionSchema)) {
      return [questionSchema.referenceDataCategory]
    }
    return []
  }

  // Get a unique set of reference data categories to fetch
  const referenceDataCategories = new Set(questionResponse.contents?.flatMap(extractReferenceDataCategories))

  // If there's no reference data categories lets return early
  if (referenceDataCategories.size === 0) {
    return questionResponse
  }

  const apiToken = await getApiToken()

  const referenceDataRequests = Array.from(referenceDataCategories).map(async category => ({
    category,
    data: await getReferenceDataListByCategory(category, apiToken),
  }))

  const referenceDataResponses = await Promise.all(referenceDataRequests)
  const referenceData = referenceDataResponses.reduce(
    (resultObject, referenceDataResponse) => ({
      ...resultObject,
      [referenceDataResponse.category]: referenceDataResponse.data.map(r => ({
        text: r.description,
        value: r.code,
      })),
    }),
    {},
  )

  const applyReferenceData = questionSchema => {
    if (questionSchema.type === 'group') {
      return { ...questionSchema, contents: questionSchema.contents.map(applyReferenceData) }
    }
    if (usesStaticReferenceData(questionSchema)) {
      return { ...questionSchema, answerDtos: referenceData[questionSchema.referenceDataCategory] }
    }
    return questionSchema
  }

  return {
    ...questionResponse,
    contents: questionResponse.contents?.map(applyReferenceData),
  }
}

module.exports = async ({ params: { groupId, subgroup = 0, page = 0 }, user }, res, next) => {
  try {
    const questions = await getAssessmentQuestions(groupId, user?.token, user?.id)
    const hydratedQuestions = await applyStaticReferenceData(questions)

    const thisQuestionGroup = hydratedQuestions.contents[subgroup].contents[page]
    const readOnlyToAttribute = q => {
      if (q.readOnly) {
        // eslint-disable-next-line no-param-reassign
        q.attributes = { readonly: true, disabled: true, ...q.attributes }
      }
      q.contents?.forEach(c => readOnlyToAttribute(c))
    }
    thisQuestionGroup.contents?.forEach(q => readOnlyToAttribute(q))
    thisQuestionGroup.contents = thisQuestionGroup.contents?.map(questionSchema => {
      const attributes = {
        ...questionSchema.attributes,
        'data-question-code': questionSchema.questionCode,
        'data-question-type': questionSchema.answerType,
      }

      if (usesDynamicReferenceData(questionSchema)) {
        const referenceDataTargets = questionSchema.referenceDataTargets.map(({ questionCode, isRequired }) => ({
          questionCode,
          isRequired,
        }))
        attributes['data-is-dynamic'] = true
        attributes['data-reference-data-targets'] = JSON.stringify(referenceDataTargets)
      }

      return {
        ...questionSchema,
        attributes,
      }
    })
    res.locals.questionGroup = processReplacements(thisQuestionGroup, res.locals.offenderDetails)

    const navigation = {
      next: findNext(hydratedQuestions, groupId, subgroup, page),
      previous: findPrevious(hydratedQuestions, groupId, subgroup, page),
      parent: findParent(hydratedQuestions, subgroup),
    }

    // put next and previous pages into locals
    res.locals.navigation = processReplacements(navigation, res.locals.offenderDetails)

    return next()
  } catch (error) {
    logger.error(`Could not retrieve question group for ${groupId}, error: ${error}`)
    return res.render('app/error', { error })
  }
}
