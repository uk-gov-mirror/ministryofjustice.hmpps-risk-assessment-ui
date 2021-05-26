class User {
  static from({ id, token, refreshToken, tokenLifetime, tokenExpiryTime, username, email } = {}) {
    const user = new User()
    user.id = id
    user.token = token
    user.refreshToken = refreshToken
    user.tokenLifetime = tokenLifetime
    user.tokenExpiryTime = tokenExpiryTime
    user.username = username
    user.email = email
    return user
  }

  updateToken({ token, refreshToken, tokenExpiryTime } = {}) {
    this.token = token
    this.refreshToken = refreshToken
    this.tokenExpiryTime = tokenExpiryTime
    return this
  }

  withDetails({ email, username } = {}) {
    this.email = email
    this.username = username
    return this
  }

  setEmail(email = {}) {
    this.email = email
  }

  getDetails() {
    return {
      email: this.email,
      username: this.username,
    }
  }

  getSession() {
    return {
      id: this.id,
      token: this.token,
      refreshToken: this.refreshToken,
      tokenLifetime: this.tokenLifetime,
      tokenExpiryTime: this.tokenExpiryTime,
    }
  }
}

module.exports = User
