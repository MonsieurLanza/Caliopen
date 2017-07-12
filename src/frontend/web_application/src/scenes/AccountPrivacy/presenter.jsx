import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AccountPrivacy extends Component {
  static propTypes = {
    __: PropTypes.func.isRequired,
  };

  state = {};

  render() {
    const { __ } = this.props;

    return (
      <div className="s-account-privacy">
        {__('account.privacy')}
      </div>
    );
  }
}

export default AccountPrivacy;
