const userUtil = require('../utils/user-util');

describe('Message list', () => {
  const EC = protractor.ExpectedConditions;

  beforeEach(() => {
    userUtil.signin();
  });

  it('list', () => {
    browser.wait(EC.presenceOf($('.s-timeline .s-message-item')), 5 * 1000)
      .then(() => element(by.cssContainingText(
        '.s-timeline .s-message-item .s-message-item__title-subject',
        'Fry! Stay back! He\'s too powerful!'
      )).click())
      .then(() => browser.wait(EC.presenceOf($('.m-message')), 5 * 1000))
      .then(() => console.log('wait success for .m-message'))
      .then(() => expect(element.all(by.css('.m-message')).count()).toEqual(2));
  });
});
