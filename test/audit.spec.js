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

  before(() => {
    sinon.stub(service, 'slack').resolves();
    sinon.stub(service, 'npmcheck')
      .resolves({
        get: () => [{
          moduleName: 'test',
          bump: 'minor',
          devDependency: false,
          installed: '1.2.0',
          latest: '1.3.5',
        }],
      });
  });

  after(() => {
    service.slack.restore();
    service.npmcheck.restore();
  });

  it('should call npm-check and post to Slack', async () => {
    await audit({ name: 'test', webhookuri });
    expect(service.slack.calledOnce).to.be.true;
    expect(service.npmcheck.calledOnce).to.be.true;
  });

  it('should create message with minor updates', async () => {
    await audit({ name: 'test', webhookuri });
    const [uri, message] = service.slack.getCall(0).args;
    expect(uri).to.be.equal(webhookuri);
    expect(message).to.have.property('attachments');
    expect(message.attachments).to.have.lengthOf(1);
    expect(message.attachments[0]).to.have.property('color', 'warning');
  });
});
