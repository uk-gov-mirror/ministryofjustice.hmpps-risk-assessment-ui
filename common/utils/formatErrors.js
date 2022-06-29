const BLANK_ERROR = 'BLANK_ERROR'
const removeBlankErrors = (errors) => (Array.isArray(errors) ? errors.filter(({ msg }) => msg !== BLANK_ERROR) : errors)
const formatErrors = (errors) => {
  return errors.reduce((obj, { param, msg, location }) => {
    const arrayObj = obj

    const errorMsg = msg.error ? msg.error : msg
    if (param) arrayObj[param] = { text: errorMsg }
    else if (arrayObj[location]) arrayObj[location].text += `. ${errorMsg}`
    else arrayObj[location] = { text: errorMsg }
    return arrayObj
  }, {})
}
const formatErrorSummary = (errors) => {
  return errors.map(({ msg, param }) => {
    let errorMsg = ''
    if (msg.errorSummary) {
      errorMsg = msg.errorSummary
    } else if (msg.error) {
      errorMsg = msg.error
    } else errorMsg = msg
    return { text: errorMsg, href: `#${param}-error` }
  })
}
module.exports = { BLANK_ERROR, removeBlankErrors, formatErrors, formatErrorSummary }
