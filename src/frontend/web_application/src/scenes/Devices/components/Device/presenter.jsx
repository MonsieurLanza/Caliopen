import React, { Component, PropTypes } from 'react';
import DeviceBase from '../../../../components/Device';
import Spinner from '../../../../components/Spinner';

class Device extends Component {
  static propTypes = {
    device: PropTypes.shape({}),
    isFetching: PropTypes.bool,
    __: PropTypes.func.isRequired,
  };

  render() {
    const { device, isFetching, __ } = this.props;

    if (isFetching) {
      return <Spinner isLoading />;
    }

    return (device && <DeviceBase device={device} __={__} />) || null;
  }
}

export default Device;
