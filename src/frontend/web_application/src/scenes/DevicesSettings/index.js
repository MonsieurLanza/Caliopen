import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withI18n } from 'lingui-react';
import { requestDevices } from '../../store/modules/device';
import Presenter from './presenter';
import DeviceSettings from './components/DeviceSettings';

export { DeviceSettings };

const devicesSelector = state => state.device.devices.map(id => state.device.devicesById[id]);
const mapStateToProps = createSelector(
  [devicesSelector],
  devices => ({ devices })
);
const mapDispatchToProps = dispatch => bindActionCreators({ requestDevices }, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withI18n()
)(Presenter);
