import React from 'react';
import { shallow } from 'enzyme';
import Presenter from './presenter';

describe('component Device DeviceInformation', () => {
  it('render', () => {
    const props = {
      device: {},
      i18n: { _: id => id },
    };

    const comp = shallow(
      <Presenter {...props} />
    );

    expect(comp.find('DefList').length).toEqual(1);
  });
});
