import { transports as _transports, createLogger, addColors } from 'winston'
import { loggingLevel, isProduction } from '../config'
import MDCAwareLogger from './mdc-aware-logger'

const loggingTransports = []
const exceptionTransports = []
const colors = {
  info: 'green',
  email: 'magenta',
  warn: 'yellow',
  error: 'red',
}

const consoleLog = new _transports.Console({
  json: isProduction,
  timestamp: true,
  colorize: true,
  level: loggingLevel.toLowerCase(),
})

loggingTransports.push(consoleLog)

exceptionTransports.push(
  new _transports.Console({
    json: isProduction,
    logstash: true,
    timestamp: true,
    colorize: true,
    stringify: function stringify(obj) {
      return JSON.stringify(obj)
    },
  }),
)

const transports = {
  transports: loggingTransports,
  exceptionHandlers: exceptionTransports,
  exitOnError: true,
}

if (!isProduction) {
  delete transports.exceptionHandlers
}

// eslint-disable-next-line new-cap
const logger = new createLogger(transports)

addColors(colors)

export default new MDCAwareLogger(logger)
