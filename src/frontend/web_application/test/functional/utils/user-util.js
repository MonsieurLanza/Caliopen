const EC = protractor.ExpectedConditions;

module.exports = {
  signin: (login, password) => {
    const loginKeys = login || 'dev';
    const passwordKeys = password || '123456';
    browser.get('/auth/signin');
    element(by.css('input[name=username]')).sendKeys(loginKeys);
    element(by.css('input[name=password]')).sendKeys(passwordKeys);
    element(by.cssContainingText('button[type=submit]', 'I\'m in a safe place')).click();
    browser.wait(EC.not(EC.urlContains('auth/signin')), 5 * 1000);
  },
  signout: () => {
    browser.get('/auth/signout');
  },
  showAccount: () => {
    const userMenu = element(by.css('.l-header__user'));
    userMenu.element(by.css('[data-toggle="co-user-menu"]')).click();
    userMenu.element(by.cssContainingText('.m-link', 'Account')).click();
    userMenu.element(by.css('[data-toggle="co-user-menu"]')).click();
    browser.wait(EC.urlContains('settings/account'), 5 * 1000);
  },
  showSettings: (pageName = null) => element(by.css('.m-user-menu .m-dropdown__trigger')).click()
    .then(() => element(by.cssContainingText('.m-user-menu .m-link', 'Settings')).click())
    .then(() => {
      if (!pageName) {
        return undefined;
      }

      return element(by.cssContainingText('.l-settings__menu-bar .m-nav-list .m-link', pageName)).click();
    }),
};
