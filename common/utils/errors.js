// eslint-disable-next-line max-classes-per-file
class AuthenticationError extends Error {
  constructor(message, ...params) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthenticationError)
    }

    this.name = 'AuthenticationError'
    this.message = message || 'There was a problem signing in'
    this.status = 401
  }
}

class ServerError extends Error {
  constructor(message, ...params) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServerError)
    }

    this.name = 'ServerError'
    this.message = message || 'We are working to fix it as quickly as possible.'
  }
}

class ForbiddenError extends Error {
  constructor(message, ...params) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ForbiddenError)
    }

    this.name = 'ForbiddenError'
    this.message = message || 'Forbidden'
  }
}

module.exports = {
  AuthenticationError,
  ServerError,
  ForbiddenError,
}
