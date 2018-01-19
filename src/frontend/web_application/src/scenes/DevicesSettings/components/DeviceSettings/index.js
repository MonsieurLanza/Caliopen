import { createSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withI18n } from 'lingui-react';
import Presenter from './presenter';

const devicesSelector = state => state.device.devicesById;
const deviceIdSelector = (state, ownProps) => ownProps.params.deviceId;

const mapStateToProps = createSelector(
  [devicesSelector, deviceIdSelector],
  (devicesById, deviceId) => ({ device: devicesById[deviceId] })
);

export default compose(
  withI18n(),
  connect(mapStateToProps)
)(Presenter);
