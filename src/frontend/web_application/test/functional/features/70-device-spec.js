const { signin } = require('../utils/user-util');

describe('device', () => {
  const clearKeypairInLocalStorage = () => browser.get('/')
    .then(() => browser.pause())
    .then(() => browser.executeScript(`
      window.localStorage.removeItem('device.curve');
      window.localStorage.removeItem('device.hash');
      window.localStorage.removeItem('device.id');
      window.localStorage.removeItem('device.priv');
    `));

  it('redirect to device management on a new device for an existing account', () => {
    clearKeypairInLocalStorage()
      .then(() => signin())
      .then(() => expect(browser.getCurrentUrl()).toContain('/settings/devices/'));
  });
});
