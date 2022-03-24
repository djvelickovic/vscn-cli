const { SUPPORTED_PROJECT_TYPES } = require('./constants')
const chalk = require('chalk')
const exec = require('./exec')
const fs = require('fs')
const { MAVEN_LIST } = require('./paths')
const path = require('path')

module.exports.scan = async (projectType, rootDir, options) => {
  console.log(projectType, rootDir, options)
  const { details } = options

  if (!SUPPORTED_PROJECT_TYPES.includes(projectType)) {
    console.log(chalk.red(`Project type '${projectType}' is not supported.`))
    return
  }
  if (!fs.existsSync(rootDir) || !fs.lstatSync(rootDir).isDirectory()) {
    console.log(chalk.red(`Directory '${rootDir}' does not exist or is not a directory`))
    return
  }

  const result = await getMvnDependencies(rootDir)
  console.log(result)
}


const getMvnDependencies = async (projectRootPath) => {
  const pomPath = path.join(projectRootPath, 'pom.xml')

  const stdOut = await exec(MAVEN_LIST, pomPath)

  return stdOut.split(/\r\n|\n/)
    .map(line => line.trim().split('--')[0])
    .filter(dependency => !dependency.endsWith('test'))
    .map(dependency => {
      const [groupId, artifactId, pkg, version, scope] = dependency.split(':')
      return {
        product: artifactId,
        version,
      }
    })
}
