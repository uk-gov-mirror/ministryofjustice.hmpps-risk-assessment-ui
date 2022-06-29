const { stubFor } = require('./wiremock')
const referenceData = require('./responses/referenceData.json')
const filteredReferenceData = require('./responses/filteredReferenceData.json')

const stubStaticReferenceData = (category) => {
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

const stubDynamicReferenceData = (field) => {
  stubFor({
    request: {
      method: 'POST',
      urlPattern: '/referencedata/filtered',
      bodyPatterns: filteredReferenceData[field].request,
    },
    response: {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      status: filteredReferenceData[field].response.status,
      jsonBody: filteredReferenceData[field].response.body,
    },
  })
}

const stubReferenceData = async () => {
  await stubStaticReferenceData('SOURCES_OF_INFORMATION')
  await stubDynamicReferenceData('ASSESSOR_OFFICE--FIRST')
  await stubDynamicReferenceData('ASSESSOR_OFFICE--SECOND')
  await stubDynamicReferenceData('ASSESSOR_OFFICE--FAIL')
}

module.exports = {
  stubReferenceData,
}
