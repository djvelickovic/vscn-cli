const path = require('path')
const exec = require('./exec')
const { MAVEN_LIST, MAVEN_PRE_RUN } = require('./paths')
const mappers = require('../bin/maven/maven-mappers.json')

module.exports.list = async (projectRootPath) => {
  const pomPath = path.join(projectRootPath, 'pom.xml')
  const stdOut = await exec(MAVEN_LIST, pomPath)
  const dependencies = extractDependencies(stdOut)
  return useMapper(dependencies)
}

module.exports.preRun = async (projectRootPath) => {
  const pomPath = path.join(projectRootPath, 'pom.xml')
  const stdOut = await exec(MAVEN_PRE_RUN, pomPath)
  const dependencies = extractDependencies(stdOut)
  return useMapper(dependencies)
}

const extractDependencies = (stdOut) => stdOut.split(/\r\n|\n/)
  .map(line => line.split('--')[0].trim())
  .filter(dependency => !dependency.endsWith('test'))
  .map(dependency => {
    const [groupId, artifactId, pkg, version, scope] = dependency.split(':')
    return {
      artifactId,
      groupId,
      version
    }
  })

const useMapper = (dependencies) => {
  return dependencies.map(mapDependency)
}

const mapDependency = (dependency) => {

  for (const { groupId, artifactId, cpe } of mappers) {
    if (groupId === dependency.groupId && (artifactId === '*' || artifactId === dependency.artifactId)) {
      // console.debug(`Override ${dependency.artifactId} with ${cpe}.`)
      return {
        product: cpe,
        version: dependency.version
      }
    }
  }
  return {
    product: dependency.artifactId,
    version: dependency.version
  }
}

