// checks if there is a keycloak request id in the headers and uses that for correlation ID if found
import { getNamespace } from 'cls-hooked'
import { clsNamespace } from '../config'
import { updateMDC } from '../utils/util'

export const updateCorrelationId = ({ headers: { 'x-request-id': correlationId } }, res, next) => {
  if (correlationId) {
    const mdcNamespace = getNamespace(clsNamespace)
    const mdc = mdcNamespace.get('MDC')
    mdc.correlationId = correlationId
    updateMDC('MDC', mdc)
  }

  next()
}
