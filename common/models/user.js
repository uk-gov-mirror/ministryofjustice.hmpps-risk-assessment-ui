class User {
  static from(other = {}) {
    const user = new User()
    user.id = other.id
    user.token = other.token
    user.refreshToken = other.refreshToken
    user.tokenLifetime = other.tokenLifetime
    user.tokenExpiryTime = other.tokenExpiryTime
    user.username = other.username
    user.email = other.email
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
