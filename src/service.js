const npmcheck = require('npm-check');
const Slack = require('slack-node');
const util = require('util');

const slack = new Slack();

module.exports = {
  npmcheck,
  slack: async (webhookuri, message) => {
    slack.setWebhook(webhookuri);
    await util.promisify(slack.webhook)(message);
  },
};
