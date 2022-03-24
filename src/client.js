const axios = require('axios').default

module.exports.scan = async (dependencies) => {
  const request = {
    dependencies: dependencies,
    metadata: {
      os: null
    }
  }
  const response = await axios.post('http://localhost:3000/scan', request)
  const { status, data } = response
  return data
}