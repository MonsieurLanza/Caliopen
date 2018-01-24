import React from 'react';
import { shallow } from 'enzyme';
import DeviceProvider from './presenter';

describe('device - DeviceProvider', () => {
  it('render', () => {
    const comp = shallow(
      <DeviceProvider>Foo</DeviceProvider>,
      { disableLifecycleMethods: true }
    );

    expect(comp.text()).toEqual('Foo');
  });
});
