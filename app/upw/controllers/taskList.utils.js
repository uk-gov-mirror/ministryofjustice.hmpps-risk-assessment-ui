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

  return answers[fieldName] === valueWhenSigned
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
    status: answers[completionField] === 'YES' || answers[completionField] === ['YES'] ? 'COMPLETE' : 'INCOMPLETE',
  }
}

const getTaskList = (baseUrl = '', steps = {}, answers = {}) => {
  const tasks = [
    {
      heading: {
        text: "Individual's details",
      },
      items: [getTask(answers, baseUrl, steps, 'individuals-details', 'upw_individual_details_complete')],
    },
    {
      heading: {
        text: 'Diversity information',
      },
      items: [
        getTask(answers, baseUrl, steps, 'gender-information', 'upw_placement_preference_by_gender_complete'),
        getTask(
          answers,
          baseUrl,
          steps,
          'cultural-and-religious-adjustments',
          'upw_cultural_religious_adjustment_complete',
        ),
        getTask(answers, baseUrl, steps, 'placement-preferences', 'upw_placement_preference_complete'),
      ],
    },
    {
      heading: {
        text: 'Risk information',
      },
      items: [
        getTask(answers, baseUrl, steps, 'risk-of-harm-in-the-community', 'upw_rosh_community_complete'),
        getTask(answers, baseUrl, steps, 'managing-risk', 'upw_managing_risk_complete'),
      ],
    },
    {
      heading: {
        text: 'Placement restrictions due to health and other needs',
      },
      items: [
        getTask(answers, baseUrl, steps, 'disabilities-and-mental-health', 'upw_disabilities_complete'),
        getTask(answers, baseUrl, steps, 'health-issues', 'upw_health_issues_complete'),
        getTask(answers, baseUrl, steps, 'gp-details', 'upw_gp_details_complete'),
        getTask(answers, baseUrl, steps, 'travel-information', 'upw_travel_information_complete'),
        getTask(answers, baseUrl, steps, 'caring-commitments', 'upw_caring_commitments_complete'),
      ],
    },
    {
      heading: {
        text: 'Employment, education and skills information',
      },
      items: [
        getTask(answers, baseUrl, steps, 'employment-education-and-skills', 'upw_employment_education_skills_complete'),
        getTask(answers, baseUrl, steps, 'training-and-employment-opportunities', 'upw_employment_training_complete'),
      ],
    },
    {
      heading: {
        text: 'Placement details',
      },
      items: [
        getTask(answers, baseUrl, steps, 'intensive-working', 'upw_eligibility_intensive_working_complete'),
        getTask(answers, baseUrl, steps, 'availability', 'upw_individual_availability_complete'),
        getTask(answers, baseUrl, steps, 'equipment', 'upw_equipment_complete'),
      ],
    },
  ]

  const declaration = {
    heading: {
      text: 'Declaration',
    },
    items: [
      getDeclarationTask(answers, baseUrl, steps, 'pdf-preview-and-declaration', tasks, 'upw_declaration_confirmation'),
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
