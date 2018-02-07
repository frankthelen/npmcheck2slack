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
  .option('-u, --username [username]', 'The username to be displayed in Slack. Defaults to your channel settings.')
  .option('-e, --emoji [emoji]', 'The emoji to be displayed in Slack, e.g., ":ghost:". Defaults to your channel settings.')
  .action(async (webhookuri, cmd) => {
    try {
      const packageJsonCwdFile = await readFile('package.json', 'UTF-8');
      const packageJsonCwd = JSON.parse(packageJsonCwdFile);
      const { name } = packageJsonCwd;
      const { username, emoji } = cmd;
      await audit({
        name, webhookuri, username, emoji,
      });
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
    }
  })
  .parse(process.argv);
