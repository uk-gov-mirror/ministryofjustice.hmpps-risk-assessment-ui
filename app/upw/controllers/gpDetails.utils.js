const convertGpDetailsEntries = answers => {
  const gpDetails = answers.gp_details || []
  const updatedGpDetails = gpDetails.map(convertGpDetails)
  return {
    ...answers,
    gp_details: updatedGpDetails,
  }
}

const createFullNameFrom = (firstName = '', familyName = '') => `${firstName} ${familyName}`.trim()

const convertGpDetails = answers => ({
  ...answers,
  gp_name: [createFullNameFrom(answers.gp_first_name, answers.gp_family_name)],
})

const unsetOldGPDetailsFields = answers => {
  return {
    ...answers,
    gp_details: (answers.gp_details || []).map(e => ({
      ...e,
      gp_first_name: [],
      gp_family_name: [],
    })),
    gp_first_name: [],
    gp_family_name: [],
  }
}

module.exports = {
  convertGpDetails,
  unsetOldGPDetailsFields,
  convertGpDetailsEntries,
}
