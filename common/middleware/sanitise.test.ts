import { urlencoded, json } from 'body-parser'
import express, { Router } from 'express'
import request from 'supertest'
import { sanitise } from './sanitise'

describe('sanitise.js', () => {
  const app = express()
  app.use(urlencoded({ extended: true }))
  app.use(json())
  app.use(sanitise())

  const spy = jest.fn()

  const paramsRouter = Router()

  paramsRouter.post('/:test', sanitise(), (req, res) => {
    spy(req.params)
    res.send()
  })

  app.use('/test-malicious-params', paramsRouter)

  app.post('/test-malicious-query', (req, res) => {
    spy(req.query)
    res.send()
  })

  app.post('/test-malicious-body', (req, res) => {
    spy(req.body)
    res.send()
  })

  beforeEach(() => spy.mockReset())

  it('should ignore safe URL params', () => {
    return request(app)
      .post(`/test-malicious-params/${encodeURIComponent('<p>Some safe HTML</p>')}`)
      .send({})
      .expect(200)
      .then(() => {
        expect(spy).toHaveBeenCalledWith({
          test: '<p>Some safe HTML</p>',
        })
      })
  })

  it('should sanitise malicious URL params', () => {
    return request(app)
      .post(`/test-malicious-params/${encodeURIComponent('<script> doSomethingNefarious(); </script>')}`)
      .send({})
      .expect(200)
      .then(() => {
        expect(spy).toHaveBeenCalledWith({
          test: '',
        })
      })
  })

  it('should ignore safe query params', () => {
    return request(app)
      .post(`/test-malicious-query/?${new URLSearchParams({ test: '<p>Some safe HTML</p>' })}`)
      .send({})
      .expect(200)
      .then(() => {
        expect(spy).toHaveBeenCalledWith({
          test: '<p>Some safe HTML</p>',
        })
      })
  })

  it('should sanitise malicious query params', () => {
    return request(app)
      .post(`/test-malicious-query/?${new URLSearchParams({ test: '<script> doSomethingNefarious(); </script>' })}`)
      .send({})
      .expect(200)
      .then(() => {
        expect(spy).toHaveBeenCalledWith({
          test: '',
        })
      })
  })

  it('should ignore a safe JSON body', () => {
    return request(app)
      .post('/test-malicious-body')
      .send({
        foo: 'test',
        bar: 1,
        baz: false,
        html: '<p>Some safe HTML</p>',
      })
      .expect(200)
      .then(() => {
        expect(spy).toHaveBeenCalledWith({
          foo: 'test',
          bar: 1,
          baz: false,
          html: '<p>Some safe HTML</p>',
        })
      })
  })

  it('should sanitise a malicious JSON body', () => {
    return request(app)
      .post('/test-malicious-body')
      .send({
        foo: '<script> doSomethingNefarious(); </script>',
        bar: '<img src="http://foo.bar.com/baz.png">',
        baz: '<p onclick="doSomethingNefarious();"> Click me! </p>',
      })
      .expect(200)
      .then(() => {
        expect(spy).toHaveBeenCalledWith({
          foo: '',
          bar: '',
          baz: '<p> Click me! </p>',
        })
      })
  })

  it('should sanitise a complex malicious JSON body', () => {
    return request(app)
      .post('/test-malicious-body')
      .send({
        nested: {
          html: '<script> doSomethingNefarious(); </script>',
        },
        list: ['<li onclick="doSomethingNefarious();"> Click me! </li>'],
      })
      .expect(200)
      .then(() => {
        expect(spy).toHaveBeenCalledWith({
          nested: {
            html: '',
          },
          list: ['<li> Click me! </li>'],
        })
      })
  })
})
