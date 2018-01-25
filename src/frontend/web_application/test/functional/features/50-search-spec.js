const userUtil = require('../utils/user-util');

describe('search', () => {
  const EC = protractor.ExpectedConditions;

  beforeEach(() => {
    userUtil.signin();
  });

  it('search for Foobar', () => {
    const searchTerms = 'Foobar';
    const tabLabel = 'Results for: Foobar';
    const msgLabel = '2 messages contains "Foobar" in their subject or content';
    const contactLabel = '0 contacts contains "Foobar" in their label or profile';

    browser.get('./')
      .then(() => element(by.css('.m-search-field__input')).sendKeys(searchTerms))
      .then(() => element(by.css('.m-search-field__button')).click())
      .then(() => browser.wait(EC.presenceOf(element(by.cssContainingText('.l-search-results__panel', msgLabel))), 5 * 1000))
      .then(() => expect(element(by.cssContainingText('.l-search-results__panel', contactLabel)).isPresent()).toEqual(true))
      .then(() => expect(element(by.cssContainingText('.m-navbar-item', tabLabel)).isPresent()).toEqual(true))
      .then(() => expect(element.all(by.css('.s-message-result-item')).count()).toEqual(2))
      .then(() => element(by.cssContainingText('.m-nav-list__item .m-link', 'Message')).click())
      .then(() => browser.wait(EC.presenceOf($('.l-search-results')), 5 * 1000))
      .then(() => expect(element(by.cssContainingText('.l-search-results__panel', msgLabel)).isPresent()).toEqual(false))
      .then(() => expect(element.all(by.css('.s-message-result-item')).count()).toEqual(2))
      ;
  });
});
