const assert = require('assert');
const service = require('../src/service');
const audit = require('../src/audit');
require('./setupTests');

describe('audit / unmocked', () => {
  it('should fail if `name` is undefined', async () => {
    try {
      await audit();
      assert.fail('ooops');
    } catch (error) {
      expect(error.name).to.be.equal('TypeError');
    }
  });

  it('should fail if `webhookuri` is undefined', async () => {
    try {
      await audit({ name: 'test' });
      assert.fail('ooops');
    } catch (error) {
      expect(error.message).to.be.equal('options.uri is a required argument');
    }
  });

  it('should fail if `webhookuri` is not valid', async () => {
    try {
      await audit({ name: 'test', webhookuri: 'test' });
      assert.fail('ooops');
    } catch (error) {
      expect(error.message).to.be.equal('Invalid URI "test"');
    }
  });

  it('should succeed if `webhookuri` is valid', async function test() {
    this.timeout(10000);
    const webhookuri = 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX';
    await audit({ name: 'test', webhookuri });
  });
});

describe('audit / mocked', () => {
  const webhookuri = 'http://localhost:9876';
  const testcase = {
    none: [],
    major: [{
      moduleName: 'test',
      bump: 'major',
      devDependency: true,
      installed: '7.2.13',
      latest: '8.0.0',
    }],
    minor: [{
      moduleName: 'test',
      bump: 'minor',
      devDependency: false,
      installed: '1.2.0',
      latest: '1.3.5',
    }],
    patch: [{
      moduleName: 'test',
      bump: 'patch',
      devDependency: false,
      installed: '1.2.0',
      latest: '1.2.1',
    }],
  };

  beforeEach(function () { // eslint-disable-line func-names, prefer-arrow-callback
    const { title } = this.test.ctx.currentTest;
    const variant = title && title.match(/([^\s]+)$/)[1]; // e.g., `minor`
    sinon.stub(service, 'slack').resolves();
    sinon.stub(service, 'npmcheck').resolves({ get: () => testcase[variant] || [] });
  });

  afterEach(() => {
    service.slack.restore();
    service.npmcheck.restore();
  });

  it('should call npm-check and post to Slack', async () => {
    await audit({ name: 'test', webhookuri });
    expect(service.slack.calledOnce).to.be.true;
    expect(service.npmcheck.calledOnce).to.be.true;
  });

  it('should create Slack message / update major', async () => {
    await audit({ name: 'test', webhookuri });
    const [uri, message] = service.slack.getCall(0).args;
    expect(uri).to.be.equal(webhookuri);
    expect(message).to.have.property('attachments');
    const { attachments } = message;
    expect(attachments).to.have.lengthOf(1);
    expect(attachments[0]).to.have.property('color', 'danger');
    expect(attachments[0]).to.have.property('pretext', 'major updates available :scream:');
  });

  it('should create Slack message / update minor', async () => {
    await audit({ name: 'test', webhookuri });
    const [uri, message] = service.slack.getCall(0).args;
    expect(uri).to.be.equal(webhookuri);
    expect(message).to.have.property('attachments');
    const { attachments } = message;
    expect(attachments).to.have.lengthOf(1);
    expect(attachments[0]).to.have.property('color', 'warning');
    expect(attachments[0]).to.have.property('pretext', 'minor updates available :grimacing:');
  });

  it('should create Slack message / update patch', async () => {
    await audit({ name: 'test', webhookuri });
    const [uri, message] = service.slack.getCall(0).args;
    expect(uri).to.be.equal(webhookuri);
    expect(message).to.have.property('attachments');
    const { attachments } = message;
    expect(attachments).to.have.lengthOf(1);
    expect(attachments[0]).to.have.property('color', 'good');
    expect(attachments[0]).to.have.property('pretext', 'patch updates available');
  });

  it('should create Slack message / update none', async () => {
    await audit({ name: 'test', webhookuri });
    const [uri, message] = service.slack.getCall(0).args;
    expect(uri).to.be.equal(webhookuri);
    expect(message).to.have.property('attachments');
    const { attachments } = message;
    expect(attachments).to.have.lengthOf(1);
    expect(attachments[0]).to.have.property('color', 'good');
    expect(attachments[0]).to.not.have.property('pretext');
    expect(attachments[0]).to.have.property('text', 'All dependencies are up-to-date. Great work! :heart:');
  });

  it('should create Slack message with branch / update none', async () => {
    await audit({ name: 'test', webhookuri, branch: 'master' });
    const [uri, message] = service.slack.getCall(0).args;
    expect(uri).to.be.equal(webhookuri);
    expect(message).to.have.property('text', '*test [master]* dependency status');
  });

  it('should not create Slack message if all up-to-date and reluctant / update none', async () => {
    await audit({ name: 'test', webhookuri, reluctant: true });
    expect(service.slack.calledOnce).to.be.false;
    expect(service.npmcheck.calledOnce).to.be.true;
  });

  it('should create Slack message if not all up-to-date and reluctant / update major', async () => {
    await audit({ name: 'test', webhookuri, reluctant: true });
    expect(service.slack.calledOnce).to.be.true;
    expect(service.npmcheck.calledOnce).to.be.true;
  });
});
