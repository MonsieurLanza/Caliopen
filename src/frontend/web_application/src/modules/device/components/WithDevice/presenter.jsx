import { Component } from 'react';
import PropTypes from 'prop-types';
import { getConfig, getPublicDevice } from '../../services/storage';
import { getKeypair } from '../../services/ecdsa';

class WithDevice extends Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
    isNew: PropTypes.bool.isRequired,
    isGenerated: PropTypes.bool.isRequired,
  };
  static defaultProps = {
  };
  state = {};

  componentDidMount() {
    this.initialize();
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isGenerated !== this.props.isGenerated) {
      this.initialize();
    }
  }

  initialize = async () => {
    const config = getConfig();
    if (!config) {
      return;
    }

    const { id, priv } = config;
    const keypair = getKeypair(priv);
    const device = getPublicDevice({ id, keypair });

    await this.setState({ device });
  }

  render() {
    const { render, isNew, isGenerated } = this.props;

    return render({ device: this.state.device, isNew, isGenerated });
  }
}

export default WithDevice;
