import { v4 } from 'uuid'
import { createNamespace, getNamespace } from 'cls-hooked'
import { clsNamespace } from '../config'

createNamespace(clsNamespace)

export function mdcSetup(req, res, next) {
  const MDC = {
    sessionId: req.sessionID,
    correlationId: v4(),
  }
  const mdcNamespace = getNamespace(clsNamespace)
  mdcNamespace.bindEmitter(req)
  mdcNamespace.bindEmitter(res)
  mdcNamespace.run(() => {
    mdcNamespace.set('MDC', MDC)
    next()
  })
}

export function getMdcForHeader() {
  const mdcNamespace = getNamespace(clsNamespace)
  if (!mdcNamespace) {
    return {}
  }
  return mdcNamespace.get('MDC')
}
