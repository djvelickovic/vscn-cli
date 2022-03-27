const path = require('path')
const exec = require('./exec')
const { MAVEN_LIST } = require('./paths')

module.exports.list = async (projectRootPath) => {
  const pomPath = path.join(projectRootPath, 'pom.xml')

  const stdOut = await exec(MAVEN_LIST, pomPath)

  return stdOut.split(/\r\n|\n/)
    .map(line => line.trim().split('--')[0])
    .filter(dependency => !dependency.endsWith('test'))
    .map(dependency => {
      const [groupId, artifactId, pkg, version, scope] = dependency.split(':')
      return {
        product: artifactId,
        version
      }
    })
}
