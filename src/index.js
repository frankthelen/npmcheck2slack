#!/usr/bin/env node

const npmCheck = require('npm-check');
const program = require('commander');
const Slack = require('slack-node');
const util = require('util');
const fs = require('fs');
const packageJson = require('../package.json');

const slack = new Slack();

const readFile = util.promisify(fs.readFile);
const post = util.promisify(slack.webhook);

const audit = async ({
  name, webhookuri, username, emoji,
}) => {
  const result = await npmCheck();
  const packages = result.get('packages').filter(pack => pack.bump);
  const major = packages.filter(pack => pack.bump === 'major');
  const minor = packages.filter(pack => pack.bump === 'minor');
  const patch = packages.filter(pack => pack.bump === 'patch');
  const line = pack => `*${pack.moduleName}*${pack.devDependency ? ' (dev)' : ''} \`${pack.installed}\` -> \`${pack.latest}\`\n`;
  const text = packs => packs.reduce((acc, pack) => `${acc}${line(pack)}`, '');
  const attachments = [];
  if (major.length > 0) {
    attachments.push({
      pretext: 'major updates available :scream:',
      text: text(major),
      color: 'danger',
    });
  }
  if (minor.length > 0) {
    attachments.push({
      pretext: 'minor updates available :grimacing:',
      text: text(minor),
      color: 'warning',
    });
  }
  if (patch.length > 0) {
    attachments.push({
      pretext: 'patch updates available',
      text: text(patch),
      color: 'good',
    });
  }
  if (!attachments.length) {
    attachments.push({
      text: '*All dependencies are up-to-date. Great work! :heart: *',
      color: 'good',
    });
  }
  slack.setWebhook(webhookuri);
  await post({
    username, // 'npm-check',
    icon_emoji: emoji, // ':ghost:',
    text: `*${name}* dependency status`,
    attachments,
  });
};

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
