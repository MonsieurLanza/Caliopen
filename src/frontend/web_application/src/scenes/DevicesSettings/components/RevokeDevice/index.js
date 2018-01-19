import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { removeDevice } from '../../../../store/modules/device';
import Presenter from './presenter';

const mapDispatchToProps = dispatch => bindActionCreators({
  onRevokeDevice: removeDevice,
}, dispatch);

export default compose(
  connect(null, mapDispatchToProps)
)(Presenter);
