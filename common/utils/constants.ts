export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
export const REFRESH_TOKEN_LIFETIME_SECONDS = 12 * 60 * 60
export const SIXTY_SECONDS = 60
export const ONE_DAY = 86400
export const STANDALONE_ASSESSMENTS = ['UPW', 'UNPAID_WORK']
export const SECTION_INCOMPLETE = 'NO_ILL_COME_BACK_LATER'
export const SECTION_COMPLETE = 'YES'

export const EVENTS = {
  ARN_NO_ROSH_DATA_AVAILABLE: 'arnNoRoshDataAvailable',
  ARN_SESSION_STARTED: 'arnSessionStarted',
  ARN_PDF_DOWNLOAD: 'arnPdfDownload',
  ARN_SECTION_STARTED: 'arnSectionStarted',
  ARN_SECTION_COMPLETED: 'arnSectionCompleted',
}

export const CACHE = {
  PERSISTED_ANSWERS: 'persistedAnswers',
  SUBMITTED_ANSWERS: 'submittedAnswers',
  ERRORS: 'errors',
  API_TOKEN: 'ui:apiToken',
}
