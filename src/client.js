const { HOST } = require('./constants')
const axios = require('axios').default


module.exports.scan = async (dependencies) => {
  const request = {
    dependencies: dependencies,
    metadata: {
      os: null
    }
  }

  const { status, data } = await axios.post(`${HOST}/scan`, request)

  if (status !== 200) {
    throw new Error(`Error getting affected products. Received status code ${status}`)
  }
  return data
}

module.exports.loadCVEs = async (cves) => {
  const { status, data } = await axios.get(`${HOST}/cve`, { params: { id: cves } })
  if (status !== 200) {
    throw new Error(`Error getting cves. Received status code ${status}`)
  }
  return data.reduce((acc, curr) => {
    acc.set(curr.id, curr)
    return acc
  }, new Map())
}