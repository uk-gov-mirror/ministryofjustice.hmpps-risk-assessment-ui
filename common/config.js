import 'dotenv/config'

const production = process.env.NODE_ENV === 'production'

function bool(v) {
  return ['true', '1', 'on', 'yes'].includes(v)
}

function get(name, fallback, options = {}) {
  const value = process.env[name]
  if (value) {
    const { parser } = options
    return parser ? parser(value) : value
  }
  if (fallback !== undefined && (!production || !options.requireInProduction)) {
    return fallback
  }
  throw new Error(`Missing env var ${name}`)
}

export const isProduction = production
export const apis = {
  hmppsAssessments: {
    url: get('HMPPS_ASSESSMENT_API_URL', 'http://localhost:9191', true),
    timeout: {
      response: get('HMPPS_ASSESSMENT_API_ENDPOINT_TIMEOUT_RESPONSE', 120000, true),
      deadline: get('HMPPS_ASSESSMENT_API_TIMEOUT_DEADLINE', 120000, true),
    },
    agent: {
      maxSockets: 100,
      maxFreeSockets: 10,
      freeSocketTimeout: 30000,
    },
  },
  offenderAssessments: {
    url: get('OFFENDER_ASSESSMENT_API_URL', 'http://localhost:9191', true),
    timeout: {
      response: get('OFFENDER_ASSESSMENT_API_ENDPOINT_TIMEOUT_RESPONSE', 20000, true),
      deadline: get('OFFENDER_ASSESSMENT_API_TIMEOUT_DEADLINE', 20000, true),
    },
    agent: {
      maxSockets: 100,
      maxFreeSockets: 10,
      freeSocketTimeout: 30000,
    },
  },
  oauth: {
    url: get('OAUTH_ENDPOINT_URL', 'http://localhost:9191/auth', true),
    externalUrl: get('OAUTH_EXTERNAL_URL', get('OAUTH_ENDPOINT_URL', 'http://localhost:9191/auth', true)),
    timeout: {
      response: get('OAUTH_API_ENDPOINT_TIMEOUT_RESPONSE', 10000, true),
      deadline: get('OAUTH_API_TIMEOUT_DEADLINE', 10000, true),
    },
    agent: {
      maxSockets: 100,
      maxFreeSockets: 10,
      freeSocketTimeout: 30000,
      verifyToken: get('OAUTH_VERIFY_TOKEN', true),
    },
  },
  pdfConverter: {
    url: get('PDF_CONVERTER_ENDPOINT', 'http://localhost:9099/forms/chromium/convert/html'),
  },
}
export const domain = `${get('INGRESS_URL', 'http://localhost:3000', true)}`
export const https = production
export const loggingLevel = get('LOGGING_LEVEL', 'INFO')
export const correlationHeader = get('CORRELATION_HEADER_NAME', 'x-request-id')
export const clsNamespace = get('CLS_NAMESPACE', 'uk.gov.digital.hmpps.service-name')
export const applicationInsights = {
  instrumentationKey: get('APPINSIGHTS_INSTRUMENTATIONKEY', ''),
  disabled: get('APPINSIGHTS_DISABLE', false, { parser: bool }),
  internalLogging: get('APPINSIGHTS_LOGGING', false, { parser: bool }),
}
export const redis = {
  host: get('REDIS_HOST', 'localhost', true),
  port: parseInt(get('REDIS_PORT', '6379'), 10),
  password: get('REDIS_PASSWORD', '', true),
  tls_enabled: get('REDIS_TLS_ENABLED', false, { parser: bool }),
  legacyMode: get('REDIS_LEGACY_MODE', true, { parser: bool }),
}
export const authClientId = get('AUTH_CLIENT_ID', 'clientId')
export const authClientSecret = get('AUTH_CLIENT_SECRET', 'clientSecret')
export const apiClientId = get('API_CLIENT_ID', 'clientId')
export const apiClientSecret = get('API_CLIENT_SECRET', 'clientSecret')
export const sessionSecret = get('SESSION_SECRET', 'superSecret')
export const speechToTextEnabled = get('SPEECH_TO_TEXT_ENABLED', false, { parser: bool })
export const displayMaintenancePage = get('DISPLAY_MAINTENANCE_PAGE', false, { parser: bool })
export const maintenancePageText = get('MAINTENANCE_PAGE_TEXT', null)
export const dev = {
  devAssessmentId: get('DEV_ASSESSMENT_ID', 'fb6b7c33-07fc-4c4c-a009-8d60f66952c4'),
  devPreSentenceQuestionGroupId: get('DEV_PRE_SENTENCE_QUESTION_GROUP_ID', '65a3924c-4130-4140-b7f4-cc39a52603bb'),
  useLocalCache: get('USE_LOCAL_CACHE', '', false),
}
export const aws = {
  useLocalStack: get('USE_LOCALSTACK', false, { parser: bool }),
  s3: {
    region: get('S3_REGION', 'eu-west-2', { requireInProduction: true }),
    bucketName: get('S3_BUCKET_NAME', 'hmpps-assessments-s3', { requireInProduction: true }),
  },
  sns: {
    region: get('SNS_REGION', 'eu-west-2', { requireInProduction: true }),
    topicArn: get('SNS_TOPIC_ARN', 'arn:aws:sns:eu-west-2:000000000000:hmpps-assessments-topic', {
      requireInProduction: true,
    }),
  },
}
export const notification = {
  active: get('SHOW_NOTIFICATION', false, { parser: bool }),
  header: get('NOTIFICATION_HEADER', null, { requireInProduction: true }),
  body: get('NOTIFICATION_BODY', null, { requireInProduction: true }),
}
