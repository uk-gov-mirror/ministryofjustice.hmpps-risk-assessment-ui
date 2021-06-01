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

module.exports = {
  AuthenticationError,
}
