import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import DefList from '../../../../components/DefList';

class DeviceInformation extends Component {
  static propTypes = {
    device: PropTypes.shape({}).isRequired,
    locale: PropTypes.string,
    i18n: PropTypes.shape({}).isRequired,
  };
  static defaultProps = {
    locale: undefined,
  };

  render() {
    const { device, locale, i18n } = this.props;

    return (
      <DefList
        definitions={[
          { title: i18n._('device.info.date_insert', { defaults: 'Insert date' }), descriptions: [<Moment format="LLL" locale={locale}>{device.date_insert}</Moment>] },
          { title: i18n._('device.info.last_seen', { defaults: 'Last connection' }), descriptions: [<Moment format="LLL" locale={locale}>{device.last_seen}</Moment>] },
          { title: i18n._('device.info.os', { defaults: 'Operating System' }), descriptions: [device.os] },
          { title: i18n._('device.info.os-version', { defaults: 'Version' }), descriptions: [device.os_version] },
        ]}
      />
    );
  }
}

export default DeviceInformation;
