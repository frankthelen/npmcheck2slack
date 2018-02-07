const assert = require('assert');
const audit = require('../src/audit');
require('./setupTests');

describe('audit', () => {
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
