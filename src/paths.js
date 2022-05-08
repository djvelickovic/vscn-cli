const path = require('path')

const ROOT_DIR = path.join(__dirname, '../')
const BIN_DIR = path.join(ROOT_DIR, '/bin')

module.exports.ROOT_DIR = ROOT_DIR

module.exports.BIN_DIR = BIN_DIR
module.exports.MAVEN_LIST = path.join(BIN_DIR, 'maven/list.sh')
module.exports.MAVEN_PRE_RUN = path.join(BIN_DIR, 'maven/preRun.sh')
module.exports.NPM_LIST = path.join(BIN_DIR, 'npm/list.sh')
