import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './presenter';

jest.mock('lingui-react', () => ({
  withI18n: () => whatever => whatever,
}));

describe('scene - Signin', () => {
  const translator = str => str;
  const noop = () => {};

  it('render', () => {
    const comp = shallow(
      <Presenter __={translator} onSignupSuccess={noop} />
    );

    expect(comp.text()).toContain('WithDevice');
  });
});
