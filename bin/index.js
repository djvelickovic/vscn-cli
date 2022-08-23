#! /usr/bin/env node

const { program } = require('commander')
const { scan } = require('../src/app')

program
  .command('scan')
  .description('Scan project for dependency vulnerabilities')
  .argument('<projectType>', 'Project Type. Supported project types [mvn, node]')
  .argument('<rootDirectory>', 'Path to the project root dir')
  .action(scan)

program.parse()