const { getDeclarationTask, getTask, getTaskList } = require('./taskList.utils')

describe('taskList.util', () => {
  describe('getDeclarationTask', () => {
    it('returns a declaration task with the name from the step definition', () => {
      const answers = {
        declaration: '',
      }

      const sections = [
        {
          items: [{ status: 'INCOMPLETE' }, { status: 'COMPLETE' }],
        },
      ]

      const steps = {
        '/first-task': {
          pageTitle: 'First task',
        },
      }

      const task = getDeclarationTask(answers, '/UPW', steps, 'first-task', sections, 'declaration')

      expect(task.text).toStrictEqual('First task')
    })

    it('returns a declaration task with the URL to the step', () => {
      const answers = {
        declaration: '',
      }

      const sections = [
        {
          items: [{ status: 'INCOMPLETE' }, { status: 'COMPLETE' }],
        },
      ]

      const steps = {
        '/first-task': {
          pageTitle: 'First task',
        },
      }

      const task = getDeclarationTask(answers, '/UPW', steps, 'first-task', sections, 'declaration')

      expect(task.href).toStrictEqual('/UPW/first-task')
    })

    it('returns "CANNOT_START" when there is an incomplete section', () => {
      const answers = {
        declaration: '',
      }

      const sections = [
        {
          items: [{ status: 'INCOMPLETE' }, { status: 'COMPLETE' }],
        },
      ]

      const steps = {
        '/first-task': {
          pageTitle: 'First task',
        },
      }

      const task = getDeclarationTask(answers, '/UPW', steps, 'first-task', sections, 'declaration')

      expect(task.status).toStrictEqual('CANNOT_START')
    })

    it('returns "INCOMPLETE" when the declaration is not signed', () => {
      const answers = {
        declaration: '',
      }

      const sections = [
        {
          items: [{ status: 'COMPLETE' }],
        },
      ]

      const steps = {
        '/first-task': {
          pageTitle: 'First task',
        },
      }

      const task = getDeclarationTask(answers, '/UPW', steps, 'first-task', sections, 'declaration')

      expect(task.status).toStrictEqual('INCOMPLETE')
    })

    it('returns "COMPLETE" when the declaration is signed', () => {
      const answers = {
        declaration: 'SIGNED',
      }

      const sections = [
        {
          items: [{ status: 'COMPLETE' }],
        },
      ]

      const steps = {
        '/first-task': {
          pageTitle: 'First task',
        },
      }

      const task = getDeclarationTask(answers, '/UPW', steps, 'first-task', sections, 'declaration')

      expect(task.status).toStrictEqual('COMPLETE')
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
})
