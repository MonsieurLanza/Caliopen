import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Trans, Plural } from 'lingui-react';
import Button from '../../../../components/Button';

import './style.scss';

class MessageSelector extends PureComponent {
  static propTypes = {
    onSelectAllMessages: PropTypes.func,
    isActive: PropTypes.bool,
  };

  static defaultProps = {
    onSelectAllMessages: str => str,
    isActive: false,
  };

  toggleCheckbox = () => {
    // this.props.onSelectAllMessages()
  }

  handleEditTags = () => {
  }

  handleDelete = () => {
  }

  render() {
    // const { isActive } = this.props;
    const fakeNumber = 4;

    return (
      <div className="m-message-selector">
        <span className="m-message-selector__title">
          {fakeNumber !== 0 &&
            <Plural
              id="message-list.message.selected"
              value={fakeNumber}
              one={<Trans># message:</Trans>}
              other={<Trans># messages:</Trans>}
            />
          }
        </span>
        {fakeNumber !== 0 && (
          <span className="m-message-selector__actions">
            <Button icon="tags" onClick={this.handleEditTags} />
            <Button icon="trash" onClick={this.handleDelete} />
          </span>
        )}
        <span className="m-message-selector__checkbox">
          <input
            type="checkbox"
            onChange={this.toggleCheckbox}
          />
        </span>
      </div>
    );
  }
}

export default MessageSelector;
