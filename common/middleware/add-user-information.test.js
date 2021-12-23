// Local dependencies
const addUserInformation = require('./add-user-information')

describe('Put keycloak header information into session', () => {
  let req
  let res
  beforeEach(() => {
    req = {
      user: { username: 'JBOND', name: 'James Bond' },
    }
    res = {
      locals: {},
    }
  })

  test('should add user name to locals', done => {
    addUserInformation(req, res, done)
    expect(res.locals.username).toEqual('JBOND')
    expect(res.locals.userFullName).toEqual('James Bond')
  })
})
