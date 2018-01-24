import { createSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { deviceStateSelector } from '../../../../store/selectors/device';
import Presenter from './presenter';

const mapStateToProps = createSelector(
  [deviceStateSelector],
  ({ isNew, isGenerated }) => ({ isNew, isGenerated })
);

export default compose(
  connect(mapStateToProps),
)(Presenter);
