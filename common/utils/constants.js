const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
const REFRESH_TOKEN_LIFETIME_SECONDS = 12 * 60 * 60
const SIXTY_SECONDS = 60

module.exports = Object.freeze({
  UUID_REGEX,
  REFRESH_TOKEN_LIFETIME_SECONDS,
  SIXTY_SECONDS,
})
