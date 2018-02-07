const npmCheck = require('npm-check');
const Promise = require('bluebird');
const Slack = require('slack-node');
const util = require('util');

const slack = new Slack();

const post = util.promisify(slack.webhook);

const audit = async ({
  name, webhookuri, username, emoji,
}) => Promise.try(async () => {
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
});

module.exports = audit;
