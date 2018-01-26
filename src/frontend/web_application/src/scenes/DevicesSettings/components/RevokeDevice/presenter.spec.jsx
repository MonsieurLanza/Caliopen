import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './presenter';

describe('component Device RevokeDevice', () => {
  it('render', () => {
    const props = {
      device: {},
      onRevokeDevice: jest.fn(),
    };

    const comp = shallow(
      <Presenter {...props} />
    );

    expect(comp.find('Button').length).toEqual(1);
  });
});
