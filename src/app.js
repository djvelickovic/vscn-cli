const { SUPPORTED_PROJECT_TYPES } = require('./constants')
const chalk = require('chalk')
const maven = require('./maven')
const client = require('./client')
const fs = require('fs')

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

  switch (projectType) {
    case 'mvn':
      return handleMaven(rootDir)
    case 'node':
      return
  }
}

const handleMaven = async (rootDir) => {
  const dependencies = await maven.list(rootDir)
  const vulnerabilities = await client.scan(dependencies)
  console.log(vulnerabilities)
}
