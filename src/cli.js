#!/usr/bin/env node

const program = require('commander');
const util = require('util');
const fs = require('fs');
const audit = require('./audit');
const packageJson = require('../package.json');

const readFile = util.promisify(fs.readFile);

program
  .version(packageJson.version, '-v, --version')
  .usage('[options] <webhookuri>')
  .option('-u, --username <username>', 'username to be displayed in Slack, defaults to channel settings')
  .option('-e, --emoji <emoji>', 'emoji to be displayed in Slack, e.g., ":ghost:", defaults to channel settings')
  .option('-b, --branch <branch>', 'branch name to be displayed in Slack')
  .option('-r, --reluctant', 'do not send any message if all dependencies are up-to-date')
  .action(async (webhookuri, cmd) => {
    try {
      const packageJsonCwdFile = await readFile('package.json', 'UTF-8');
      const packageJsonCwd = JSON.parse(packageJsonCwdFile);
      const { name } = packageJsonCwd;
      const {
        username, emoji, branch, reluctant,
      } = cmd;
      await audit({
        name, webhookuri, username, emoji, branch, reluctant,
      });
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  })
  .parse(process.argv);
