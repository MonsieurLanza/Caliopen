import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import { Button } from '../../../../components';
import './style.scss';

class RevokeDevice extends Component {
  static propTypes = {
    device: PropTypes.shape({}).isRequired,
    onRevokeDevice: PropTypes.func.isRequired,
  };

  handleRevoke = () => {
    const { device, onRevokeDevice } = this.props;
    onRevokeDevice({ device });
  };

  render() {
    return (
      <div className="m-device-revoke">
        <Button
          className="m-device-revoke__button"
          shape="plain"
          color="alert"
          onClick={this.handleRevoke}
        ><Trans id="device.action.revoke">Revoke this device</Trans></Button>
      </div>
    );
  }
}

export default RevokeDevice;
