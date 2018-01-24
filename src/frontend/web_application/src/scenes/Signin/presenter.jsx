import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import SigninForm from './components/SigninForm';
import { WithDevice } from '../../modules/device';

const URL_DEVICES = '/settings/devices';

const getRedirect = (queryString) => {
  const paramRedirect = queryString.split(/[?|&]/).find(str => /^redirect/.test(str));

  return paramRedirect ? paramRedirect.split('=')[1] : undefined;
};

class Signin extends Component {
  static propTypes = {
    initSettings: PropTypes.func.isRequired,
    location: PropTypes.shape({}).isRequired,
    i18n: PropTypes.shape({}).isRequired,
  };

  state = {
    errors: {},
    isAuthenticated: false,
  };

  componentWillMount() {
    this.initTranslation();
  }

  initTranslation() {
    const { i18n } = this.props;
    this.localizedErrors = {
      ERR_REQUIRED_USERNAME: i18n._('signin.feedback.required_username', { defaults: 'A username is required' }),
      ERR_REQUIRED_PASSWORD: i18n._('signin.feedback.required_password', { defaults: 'A password is required' }),
      ERR_INVALID_GLOBAL: i18n._('signin.feedback.invalid', { defaults: 'Credentials are invalid' }),
    };
  }

  handleSignin = (context, formValues) => {
    axios.post('/auth/signin', {
      context,
      ...formValues,
    }, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    }).then(this.handleSigninSuccess, this.handleSigninError);
  }

  handleSigninSuccess = () => {
    this.props.initSettings();
    this.setState({ isAuthenticated: true });
  }

  handleSigninError = (err) => {
    const isExpectedError = err.response &&
      err.response.status >= 400 &&
      err.response.status < 500 &&
      err.response.data.errors;

    const getLocalizedError = (msg, field) => this.localizedErrors[`${msg}_${field.toUpperCase()}`];

    if (isExpectedError) {
      const { errors } = err.response.data;
      const localizedErrors = Object.keys(errors).reduce((prev, field) => (
        { ...prev, [field]: errors[field].map(msg => getLocalizedError(msg, field)) }
      ), {});
      this.setState({ errors: localizedErrors });
    } else {
      throw err;
    }
  }

  renderForm = (isAuthenticated, { device, isNew }) => {
    if (isAuthenticated && isNew) {
      return <Redirect push to={`${URL_DEVICES}/${device.device_id}`} />;
    }

    if (this.state.isAuthenticated) {
      const { location: { search } } = this.props;
      const redirect = getRedirect(search) || '/';

      return <Redirect push to={redirect} />;
    }

    return (
      <SigninForm
        onSubmit={this.handleSignin}
        errors={this.state.errors}
      />
    );
  }

  render() {
    return (
      <WithDevice
        render={
          ({ device, isNew }) => this.renderForm(this.state.isAuthenticated, { device, isNew })
        }
      />
    );
  }
}

export default Signin;
