class User {
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

  withDetails({ isActive, email, oasysUserCode, username, areaCode, areaName } = {}) {
    this.isActive = isActive
    this.email = email
    this.oasysUserCode = oasysUserCode
    this.username = username
    this.areaCode = areaCode
    this.areaName = areaName
    return this
  }

  getDetails() {
    return {
      isActive: this.isActive,
      email: this.email,
      oasysUserCode: this.oasysUserCode,
      username: this.username,
      areaCode: this.areaCode,
      areaName: this.areaName,
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
