const sanitizeHtml = require('sanitize-html')

function hasOwn(object, key) {
  const keys = Reflect.ownKeys(object).filter((item) => typeof item !== 'symbol')
  return keys.includes(key)
}

const initializeOptions = (options) => {
  const sanitizerOptions = {}
  if (hasOwn(options, 'allowedTags') && Array.isArray(options.allowedTags) && options.allowedTags.length > 0) {
    sanitizerOptions.allowedTags = options.allowedTags
  }

  if (hasOwn(options, 'allowedAttributes') && Object.keys(options.allowedAttributes).length > 0) {
    sanitizerOptions.allowedAttributes = options.allowedAttributes
  }

  return {
    allowedKeys: (hasOwn(options, 'allowedKeys') && Array.isArray(options.allowedKeys) && options.allowedKeys) || [],
    sanitizerOptions,
  }
}

function sanitiseValue(data, options = {}) {
  const initialisedOptions = initializeOptions(options)

  if (typeof data === 'string') {
    return sanitizeHtml(data, initialisedOptions.sanitizerOptions)
  }

  if (Array.isArray(data)) {
    return data.map((item) => {
      if (typeof item === 'string') {
        return sanitizeHtml(item, initialisedOptions.sanitizerOptions)
      }
      if (Array.isArray(item) || typeof item === 'object') {
        return sanitiseValue(item, initialisedOptions)
      }
      return item
    })
  }

  const modifiedData = { ...data }

  if (typeof modifiedData === 'object' && modifiedData !== null) {
    Object.keys(modifiedData).forEach((key) => {
      if (initialisedOptions.allowedKeys.includes(key)) {
        return
      }
      const item = modifiedData[key]
      if (typeof item === 'string') {
        modifiedData[key] = sanitizeHtml(item, initialisedOptions.sanitizerOptions)
      } else if (Array.isArray(item) || typeof item === 'object') {
        modifiedData[key] = sanitiseValue(item, initialisedOptions)
      }
    })
  }

  return modifiedData
}

function middleware(options = {}) {
  return (req, res, next) => {
    Array.of('body', 'params', 'headers').forEach((property) => {
      if (req[property]) {
        req[property] = sanitiseValue(req[property], options)
      }
    })

    const sanitizedQuery = sanitiseValue(req.query, options)
    Object.defineProperty(req, 'query', {
      value: sanitizedQuery,
      writable: false,
      configurable: true,
      enumerable: true,
    })

    next()
  }
}

module.exports = {
  sanitise: middleware,
}
