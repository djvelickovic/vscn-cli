const util = require('util')
const exec = util.promisify(require('child_process').exec)

module.exports = async (scriptPath, ...args) => {
  const command = `${scriptPath} ${args.join(' ')}`
  const { stdout, stderr } = await exec(command)
  if (stderr) {
    throw new Error(`Failed to execute script ${scriptPath}. Error:\n${stderr}`)
  }
  return stdout
}
