const { SECTION_COMPLETE } = require('../../../common/utils/constants')

const checkAllTasksAreComplete = sections => {
  return sections.every(section => {
    const tasks = section.items || []
    return tasks.every(task => task.status === 'COMPLETE')
  })
}

const checkDeclarationIsSigned = (answers, fieldName, valueWhenSigned) => {
  if (!answers || !fieldName || !valueWhenSigned) {
    return false
  }

  return answers[fieldName] && answers[fieldName][0] === valueWhenSigned
}

const getDeclarationStatus = (answers, tasks, fieldName) => {
  if (!checkAllTasksAreComplete(tasks)) {
    return 'CANNOT_START'
  }
  return checkDeclarationIsSigned(answers, fieldName, 'SIGNED') ? 'COMPLETE' : 'INCOMPLETE'
}

const getDeclarationTask = (answers, baseUrl, steps, taskName, otherSections, declarationFieldName) => {
  return {
    text: steps[`/${taskName}`]?.pageTitle || 'Unknown Task',
    href: `${baseUrl}/${taskName}`,
    status: getDeclarationStatus(answers, otherSections, declarationFieldName),
  }
}

const getTask = (answers, baseUrl, steps, taskName, completionField) => {
  return {
    text: steps[`/${taskName}`]?.pageTitle || 'Unknown Task',
    href: `${baseUrl}/${taskName}` || '#',
    status: answers[completionField]?.toString().toUpperCase() === SECTION_COMPLETE ? 'COMPLETE' : 'INCOMPLETE',
    id: steps[`/${taskName}`]?.id,
  }
}

const getTaskList = (baseUrl = '', steps = {}, answers = {}) => {
  const tasks = [
    {
      heading: {
        text: "Individual's details",
      },
      items: [getTask(answers, baseUrl, steps, 'individuals-details', 'individual_details_complete')],
    },
    {
      heading: {
        text: 'Diversity information',
      },
      items: [
        getTask(answers, baseUrl, steps, 'gender-information', 'placement_preference_by_gender_complete'),
        getTask(
          answers,
          baseUrl,
          steps,
          'cultural-and-religious-adjustments',
          'cultural_religious_adjustment_complete',
        ),
        getTask(answers, baseUrl, steps, 'placement-preferences', 'placement_preference_complete'),
      ],
    },
    {
      heading: {
        text: 'Risk information',
      },
      items: [
        getTask(answers, baseUrl, steps, 'risk-of-harm-in-the-community', 'rosh_community_complete'),
        getTask(answers, baseUrl, steps, 'managing-risk', 'managing_risk_complete'),
      ],
    },
    {
      heading: {
        text: 'Placement restrictions due to health and other needs',
      },
      items: [
        getTask(answers, baseUrl, steps, 'disabilities-and-mental-health', 'disabilities_complete'),
        getTask(answers, baseUrl, steps, 'health-issues', 'health_issues_complete'),
        getTask(answers, baseUrl, steps, 'gp-details', 'gp_details_complete'),
        getTask(answers, baseUrl, steps, 'travel-information', 'travel_information_complete'),
        getTask(answers, baseUrl, steps, 'caring-commitments', 'caring_commitments_complete'),
      ],
    },
    {
      heading: {
        text: 'Employment, education and skills information',
      },
      items: [
        getTask(answers, baseUrl, steps, 'employment-education-and-skills', 'employment_education_skills_complete'),
        getTask(answers, baseUrl, steps, 'training-and-employment-opportunities', 'employment_training_complete'),
      ],
    },
    {
      heading: {
        text: 'Placement details',
      },
      items: [
        getTask(answers, baseUrl, steps, 'intensive-working', 'eligibility_intensive_working_complete'),
        getTask(answers, baseUrl, steps, 'availability', 'individual_availability_complete'),
        getTask(answers, baseUrl, steps, 'equipment', 'equipment_complete'),
      ],
    },
  ]

  if (answers.gender_identity && answers.gender_identity[0] === 'MALE') {
    // find section with an item with text: placement preferences, and remove from task list
    let taskIndex
    let itemIndex
    tasks.forEach((task, taskNumber) => {
      task.items?.forEach((item, taskItemNumber) => {
        if (item.text === 'Placement preferences') {
          taskIndex = taskNumber
          itemIndex = taskItemNumber
        }
      })
    }, tasks)

    if (taskIndex && itemIndex) delete tasks[taskIndex].items[itemIndex]
  }

  const declaration = {
    heading: {
      text: 'Declaration',
    },
    items: [
      getDeclarationTask(answers, baseUrl, steps, 'pdf-preview-and-declaration', tasks, 'declaration_confirmation'),
    ],
  }

  const allSections = [...tasks, declaration]

  return { sections: allSections, allowedToSubmit: checkAllTasksAreComplete(allSections) }
}

module.exports = {
  getDeclarationTask,
  getTask,
  getTaskList,
}
