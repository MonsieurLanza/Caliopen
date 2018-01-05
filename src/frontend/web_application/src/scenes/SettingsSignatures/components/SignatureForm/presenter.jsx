import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans } from 'lingui-react';
import Button from '../../../../components/Button';
import { FormGrid, FormRow, FormColumn, TextareaFieldGroup, FieldErrors } from '../../../../components/form';

function generateStateFromProps(props, prevState) {
  return {
    settings: {
      ...prevState.settings,
      ...props.settings,
    },
  };
}

class SignatureForm extends Component {
  static propTypes = {
    errors: PropTypes.shape({}),
    onSubmit: PropTypes.func.isRequired,
    i18n: PropTypes.shape({}).isRequired,
  };
  static defaultProps = {
    errors: {},
  };

  state = {
    settings: {
      signature: '',
    },
  };

  componentWillMount() {
    this.setState(prevState => generateStateFromProps(this.props, prevState));
  }

  componentWillReceiveProps(newProps) {
    this.setState(prevState => generateStateFromProps(newProps, prevState));
  }

  getOptionsFromArray = (options, setting) => {
    const selectedOptions = options.map(value => ({
      value,
      label: value,
      selected: setting === value && setting !== null && true,
    }));

    return selectedOptions;
  }

  handleTextareaChange = (/* ev */) => {
    // const { name, value } = ev.target;

    // this.setState((prevState) => {});
  }

  handleSubmit = () => {
    const { settings } = this.state;
    this.props.onSubmit({ settings });
  }

  render() {
    const { errors, i18n } = this.props;

    return (
      <FormGrid className="m-signature-form">
        <form method="post" name="signature_form">
          {errors.global && errors.global.length !== 0 && (
          <FormRow>
            <FormColumn bottomSpace>
              <FieldErrors errors={errors.global} />
            </FormColumn>
          </FormRow>
          )}
          <FormRow>
            <FormColumn size="shrink" bottomSpace >
              <TextareaFieldGroup
                name="signature"
                defaultValue={this.state.settings.signature}
                onChange={this.handleTextareaChange}
                label={i18n._('settings.signature.label', { defaults: 'Signature' })}
                showTextLabel
              />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size="shrink" className="m-signature-form__action" bottomSpace>
              <Button
                type="submit"
                onClick={this.handleSubmit}
                shape="plain"
              ><Trans id="settings.signature.update.action">Save</Trans></Button>
            </FormColumn>
          </FormRow>
        </form>
      </FormGrid>
    );
  }
}

export default SignatureForm;
