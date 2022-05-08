const chalk = require('chalk')
const path = require('path')

module.exports.printInfo = (projectType, relativeRootPath) => {
  console.log(chalk.blue(`Scanning project type`), chalk.bold.blue(projectType), chalk.blue(`on location`), chalk.bold.blue(path.join(process.cwd(), relativeRootPath)))
}

module.exports.printFoundInfo = (vulnerabilities) => {
  console.log('')
  console.log(chalk.red('Scan run at: '), chalk.bold.red(new Date().toLocaleString()))
  console.log(chalk.red('Found'), chalk.bold.red(vulnerabilities), chalk.red('vulnerabilities'))
}

module.exports.printCveDetails = (affectedDependencies, cveDetails) => {


  affectedDependencies.forEach(affected => {

    const { dependency, vulnerabilities } = affected
    const { product, version } = dependency

    vulnerabilities.map(cveId => {
      const { desc, ref, severity, published } = cveDetails.get(cveId)

      console.log('')
      console.log(chalk.red('-------------------------------------------------------------------------------------'))
      console.log('')
      console.log(chalk.blue('-- Product:'), chalk.red(product))
      console.log(chalk.blue('-- Version:'), chalk.red(version))
      console.log(chalk.blue('-- CVE:'), chalk.red(cveId))
      console.log(chalk.blue('-- Severity:'), chalk.red(severity))
      console.log(chalk.blue('-- Published:'), chalk.red(published))
      console.log('')

      console.log(chalk.blue('-- Description --'))
      console.log(desc)
      console.log('')

      console.log(chalk.blue('-- References --'))
      console.log(ref.join('\n'))
      console.log('')
    })
  })
}


