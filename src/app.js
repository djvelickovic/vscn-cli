const { SUPPORTED_PROJECT_TYPES } = require('./constants')
const maven = require('./maven')
const client = require('./client')
const fs = require('fs')
const printer = require('./printer')

module.exports.scan = async (projectType, relativeRootPath) => {

  printer.printInfo(projectType, relativeRootPath)

  validateProjectType(projectType)
  validateRootDir(relativeRootPath)

  const affectedDependencies = await scan(projectType, relativeRootPath)
  const cves = affectedDependencies.flatMap(v => v.vulnerabilities)
  printer.printFoundInfo(cves.length)

  if (cves.length > 0) {
    const details = await client.loadCVEs(cves)
    printer.printCveDetails(affectedDependencies, details)
  }
}

const scan = async (type, relativePath) => {
  switch (type) {
    case 'mvn':
      return mavenScan(relativePath)
    case 'node':
      return
  }
}

const mavenScan = async (rootDir) => {
  await maven.preRun(rootDir)
  const dependencies = await maven.list(rootDir)
  return client.scan(dependencies)
}

const validateProjectType = (projectType) => {
  if (!SUPPORTED_PROJECT_TYPES.includes(projectType)) {
    throw new Error(`Project type '${projectType}' is not supported.`)
  }
}

const validateRootDir = (rootDir) => {
  if (!fs.existsSync(rootDir) || !fs.lstatSync(rootDir).isDirectory()) {
    throw new Error(`Directory '${rootDir}' does not exist or is not a directory`)
  }
}



