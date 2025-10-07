export default class User {
  static from(other = {}) {
    const user = new User()
    user.id = other.id
    user.token = other.token
    user.refreshToken = other.refreshToken
    user.tokenLifetime = other.tokenLifetime
    user.tokenExpiryTime = other.tokenExpiryTime
    return user
  }

  updateToken({ token, refreshToken, tokenExpiryTime } = {}) {
    this.token = token
    this.refreshToken = refreshToken
    this.tokenExpiryTime = tokenExpiryTime
    return this
  }

  withDetails({ username, name } = {}) {
    this.username = username
    this.name = name || username
    return this
  }

  getDetails() {
    return {
      username: this.username,
      name: this.name,
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
