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

  return checkDeclarationIsSigned(answers, fieldName, 'COMPLETE') ? 'COMPLETE' : 'INCOMPLETE'
}

const getDeclarationTask = (answers, baseUrl, steps, taskName, otherSections, declarationFieldName) => {
  return {
    text: steps[`/${taskName}`]?.pageTitle || 'Unknown Task',
    href: `${baseUrl}/${taskName}`,
    status: getDeclarationStatus(answers, otherSections, declarationFieldName),
  }
}

const getTask = (answers, baseUrl, steps, taskName) => {
  return {
    text: steps[`/${taskName}`]?.pageTitle || 'Unknown Task',
    href: `${baseUrl}/${taskName}` || '#',
    status: answers[`section-complete-${taskName}`] === 'YES' ? 'COMPLETE' : 'INCOMPLETE',
  }
}

const getTaskList = (baseUrl = '', steps = {}, answers = {}) => {
  const tasks = [
    {
      heading: {
        text: "Individual's details",
      },
      items: [getTask(answers, baseUrl, steps, 'individuals-details')],
    },
    {
      heading: {
        text: 'Diversity information',
      },
      items: [
        getTask(answers, baseUrl, steps, 'cultural-and-religious-adjustments'),
        getTask(answers, baseUrl, steps, 'placement-preferences'),
        getTask(answers, baseUrl, steps, 'options-gender-identity'),
      ],
    },
    {
      heading: {
        text: 'Risk information',
      },
      items: [
        getTask(answers, baseUrl, steps, 'risk-of-harm-in-the-community'),
        getTask(answers, baseUrl, steps, 'managing-risk'),
      ],
    },
    {
      heading: {
        text: 'Placement restrictions due to health and other needs',
      },
      items: [
        getTask(answers, baseUrl, steps, 'disabilities-and-mental-health'),
        getTask(answers, baseUrl, steps, 'health-issues'),
        getTask(answers, baseUrl, steps, 'travel-information'),
        getTask(answers, baseUrl, steps, 'caring-commitments'),
      ],
    },
    {
      heading: {
        text: 'Employment, education and skills information',
      },
      items: [
        getTask(answers, baseUrl, steps, 'employment-education-and-skills'),
        getTask(answers, baseUrl, steps, 'training-and-employment-opportunities'),
      ],
    },
    {
      heading: {
        text: 'Placement details',
      },
      items: [
        getTask(answers, baseUrl, steps, 'availability'),
        getTask(answers, baseUrl, steps, 'intensive-working'),
        getTask(answers, baseUrl, steps, 'equipment'),
      ],
    },
  ]

  const declaration = {
    heading: {
      text: 'PDF preview and declaration',
    },
    items: [getDeclarationTask(answers, baseUrl, steps, 'pdf-preview-and-declaration', tasks, 'declaration')],
  }

  return { sections: [...tasks, declaration] }
}

module.exports = {
  getDeclarationTask,
  getTask,
  getTaskList,
}
