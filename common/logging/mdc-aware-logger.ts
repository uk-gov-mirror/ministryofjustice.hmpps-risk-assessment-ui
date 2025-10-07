import extend from 'lodash/extend'
import { getNamespace } from 'cls-hooked'
import { clsNamespace } from '../config'

export default class {
  constructor(logger, MDC) {
    this.logger = logger
    this.MDC = MDC
  }

  debug(msg, meta) {
    this.logger.debug(msg, this.withMDC(meta))
  }

  error(msg, meta) {
    this.logger.error(msg, this.withMDC(meta))
  }

  info(msg, meta) {
    this.logger.info(msg, this.withMDC(meta))
  }

  silly(msg, meta) {
    this.logger.silly(msg, this.withMDC(meta))
  }

  verbose(msg, meta) {
    this.logger.verbose(msg, this.withMDC(meta))
  }

  warn(msg, meta) {
    this.logger.warn(msg, this.withMDC(meta))
  }

  log(level, msg, meta) {
    this.logger.log(level, msg, this.withMDC(meta))
  }

  withMDC(meta) {
    const mdcNamespace = getNamespace(clsNamespace)
    if (!mdcNamespace) {
      return meta
    }
    if (meta) {
      return extend(meta, mdcNamespace.get('MDC'))
    }
    return mdcNamespace.get('MDC')
  }
}
