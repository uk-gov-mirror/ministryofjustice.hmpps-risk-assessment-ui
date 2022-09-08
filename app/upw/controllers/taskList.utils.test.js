const { getPdfPreviewTask, getTask, getTaskList, hasRiskFlags } = require('./taskList.utils')

describe('taskList.util', () => {
  describe('getPdfPreviewTask', () => {
    it('returns a pdf-preview task with the name from the step definition', () => {
      const sections = [
        {
          items: [{ status: 'COMPLETE' }, { status: 'COMPLETE' }],
        },
      ]

      const steps = {
        '/first-task': {
          pageTitle: 'First task',
        },
        '/second-task': {
          pageTitle: 'Second task',
        },
        '/pdf-preview': {
          pageTitle: 'Preview PDF',
        },
      }

      const task = getPdfPreviewTask('/UPW', steps, 'pdf-preview', sections)

      expect(task.text).toStrictEqual('Preview PDF')
    })

    it('returns a pdf-preview task with the URL to the step', () => {
      const sections = [
        {
          items: [{ status: 'COMPLETE' }, { status: 'COMPLETE' }],
        },
      ]

      const steps = {
        '/first-task': {
          pageTitle: 'First task',
        },
        '/second-task': {
          pageTitle: 'Second task',
        },
        '/pdf-preview': {
          pageTitle: 'Preview PDF',
        },
      }

      const task = getPdfPreviewTask('/UPW', steps, 'pdf-preview', sections)

      expect(task.href).toStrictEqual('/UPW/pdf-preview')
    })

    it('returns "VIEW_PDF" when all sections are complete', () => {
      const sections = [
        {
          items: [{ status: 'COMPLETE' }, { status: 'COMPLETE' }],
        },
      ]

      const steps = {
        '/first-task': {
          pageTitle: 'First task',
        },
        '/second-task': {
          pageTitle: 'Second task',
        },
        '/pdf-preview': {
          pageTitle: 'Preview PDF',
        },
      }

      const task = getPdfPreviewTask('/UPW', steps, 'pdf-preview', sections)

      expect(task.status).toStrictEqual('VIEW_PDF')
    })

    it('returns "CANNOT_VIEW_PDF" when there is an incomplete section', () => {
      const sections = [
        {
          items: [
            { status: 'INCOMPLETE', active: true },
            { status: 'COMPLETE', active: true },
          ],
        },
      ]

      const steps = {
        '/first-task': {
          pageTitle: 'First task',
        },
        '/second-task': {
          pageTitle: 'Second task',
        },
        '/pdf-preview': {
          pageTitle: 'Preview PDF',
        },
      }

      const task = getPdfPreviewTask('/UPW', steps, 'pdf-preview', sections)

      expect(task.status).toStrictEqual('CANNOT_VIEW_PDF')
    })
  })

  describe('getTask', () => {
    it('returns a task with the name from the step definition', () => {
      const answers = {
        'section-complete-first-task': '',
      }

      const steps = {
        '/first-task': {
          pageTitle: 'First task',
        },
      }

      const task = getTask(answers, '/UPW', steps, 'first-task')

      expect(task.text).toStrictEqual('First task')
    })

    it('returns a task with the URL to the step', () => {
      const answers = {
        'section-complete-first-task': '',
      }

      const steps = {
        '/first-task': {
          pageTitle: 'First task',
        },
      }

      const task = getTask(answers, '/UPW', steps, 'first-task')

      expect(task.href).toStrictEqual('/UPW/first-task')
    })

    it('returns "INCOMPLETE" when "Mark this sections as complete?" is unanswered', () => {
      const answers = {
        'section-complete-first-task': '',
      }

      const steps = {
        '/first-task': {
          pageTitle: 'First task',
        },
      }

      const task = getTask(answers, '/UPW', steps, 'first-task')

      expect(task.href).toStrictEqual('/UPW/first-task')
    })

    it('returns "INCOMPLETE" when "Mark this sections as complete?" is answered "NO"', () => {
      const answers = {
        first_task_complete: 'NO',
      }

      const steps = {
        '/first-task': {
          pageTitle: 'First task',
        },
      }

      const task = getTask(answers, '/UPW', steps, 'first-task', 'first_task_complete')

      expect(task.href).toStrictEqual('/UPW/first-task')
    })

    it('returns "COMPLETE" when "Mark this sections as complete?" is answered "YES"', () => {
      const answers = {
        first_task_complete: 'YES',
      }

      const steps = {
        '/first-task': {
          pageTitle: 'First task',
        },
      }

      const task = getTask(answers, '/UPW', steps, 'first-task', 'first_task_complete')

      expect(task.status).toStrictEqual('COMPLETE')
    })
  })

  describe('getTaskList', () => {
    it('returns a task list', () => {
      const answers = {}
      const steps = {}

      const taskList = getTaskList('/UPW', steps, answers)

      expect(taskList.sections.length).toBe(7)
    })
  })

  describe('hasRiskFlags', () => {
    it('returns true when present', () => {
      const flags = [{ code: 'MSP' }]
      const requiredCodes = ['MSP']

      expect(hasRiskFlags(flags, requiredCodes)).toBe(true)
    })

    it('returns false when not present', () => {
      const flags = []
      const requiredCodes = ['MSP']

      expect(hasRiskFlags(flags, requiredCodes)).toBe(false)
    })

    it('handles when flags are undefined', () => {
      const flags = undefined
      const requiredCodes = ['MSP']

      expect(hasRiskFlags(flags, requiredCodes)).toBe(false)
    })
  })
})
