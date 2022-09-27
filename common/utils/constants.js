const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
const REFRESH_TOKEN_LIFETIME_SECONDS = 12 * 60 * 60
const SIXTY_SECONDS = 60
const ONE_DAY = 86400
const STANDALONE_ASSESSMENTS = ['UPW', 'RSR', 'UNPAID_WORK']
const SECTION_INCOMPLETE = 'NO_ILL_COME_BACK_LATER'
const SECTION_COMPLETE = 'YES'

const EVENTS = {
  ARN_NO_ROSH_DATA_AVAILABLE: 'arnNoRoshDataAvailable',
  ARN_SESSION_STARTED: 'arnSessionStarted',
  ARN_PDF_DOWNLOAD: 'arnPdfDownload',
  ARN_SECTION_STARTED: 'arnSectionStarted',
  ARN_SECTION_COMPLETED: 'arnSectionCompleted',
}

const CACHE = {
  PERSISTED_ANSWERS: 'persistedAnswers',
  SUBMITTED_ANSWERS: 'submittedAnswers',
  ERRORS: 'errors',
  API_TOKEN: 'ui:apiToken',
}

module.exports = Object.freeze({
  UUID_REGEX,
  REFRESH_TOKEN_LIFETIME_SECONDS,
  SIXTY_SECONDS,
  ONE_DAY,
  STANDALONE_ASSESSMENTS,
  SECTION_INCOMPLETE,
  SECTION_COMPLETE,
  EVENTS,
  CACHE,
})
