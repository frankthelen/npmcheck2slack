const Promise = require('bluebird');
const service = require('./service');

const audit = async ({
  name, webhookuri, username, emoji, branch,
}) => Promise.try(async () => {
  const result = await service.npmcheck();
  const packages = result.get('packages');
  const major = packages.filter(pack => pack.bump === 'major');
  const minor = packages.filter(pack => pack.bump === 'minor');
  const patch = packages.filter(pack => pack.bump === 'patch');
  const line = pack => `*${pack.moduleName}*${pack.devDependency ? ' (dev)' : ''} \`${pack.installed}\` -> \`${pack.latest}\``;
  const text = packs => packs.reduce((acc, pack) => `${acc}${line(pack)}\n`, '');
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
      text: 'All dependencies are up-to-date. Great work! :heart:',
      color: 'good',
    });
  }
  const branchText = branch ? ` [${branch}]` : '';
  await service.slack(webhookuri, {
    username,
    icon_emoji: emoji,
    text: `*${name}${branchText}* dependency status`,
    attachments,
  });
});

module.exports = audit;
