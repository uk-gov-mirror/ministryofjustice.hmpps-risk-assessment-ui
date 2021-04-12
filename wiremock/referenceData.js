const { stubFor } = require('./wiremock')
const referenceData = require('./responses/referenceData.json')

const stubStaticReferenceData = category => {
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/referencedata/${category}`,
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: 200,
      jsonBody: referenceData[category],
    },
  })
}

const stubReferenceData = async () => {
  await stubStaticReferenceData('SOURCES_OF_INFORMATION')
}

module.exports = {
  stubReferenceData,
}
