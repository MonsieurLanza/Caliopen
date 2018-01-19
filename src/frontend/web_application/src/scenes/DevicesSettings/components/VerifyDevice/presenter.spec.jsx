import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './presenter';

describe('component Device VerifyDevice', () => {
  it('render', () => {
    const props = {
      device: {},
      onDeleteDevice: jest.fn(),
      onVerifyDevice: jest.fn(),
    };

    const comp = shallow(
      <Presenter {...props} />
    );

    expect(comp.find('Button').length).toEqual(2);
  });
});
