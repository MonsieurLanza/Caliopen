import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans, Plural } from 'lingui-react';
import Button from '../../../../components/Button';

import './style.scss';

class MessageSelector extends Component {
  static propTypes = {
    onSelectAllMessages: PropTypes.func,
    count: PropTypes.number,
    indeterminate: PropTypes.bool,
  };

  static defaultProps = {
    onSelectAllMessages: str => str,
    count: 0,
    indeterminate: false,
  };

  componentDidMount() {
    this.selector.indeterminate = this.props.indeterminate;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.indeterminate !== this.props.indeterminate) {
      this.selector.indeterminate = this.props.indeterminate;
    }
  }

  toggleCheckbox = () => {
    // const { checked } = ev.target;
  }

  handleEditTags = () => {
  }

  handleDelete = () => {
  }

  render() {
    const { count } = this.props;

    return (
      <div className="m-message-selector">
        {count !== 0 && (
          <span className="m-message-selector__title">
            <Plural
              id="message-list.message.selected"
              value={count}
              one={<Trans># message:</Trans>}
              other={<Trans># messages:</Trans>}
            />
          </span>
        )}
        <span className="m-message-selector__actions">
          <Button icon="tags" onClick={this.handleEditTags} disabled={count === 0} />
          <Button icon="trash" onClick={this.handleDelete} disabled={count === 0} />
        </span>
        <span className="m-message-selector__checkbox">
          <input
            type="checkbox"
            onChange={this.toggleCheckbox}
            ref={el => (this.selector = el)}
          />
        </span>
      </div>
    );
  }
}

export default MessageSelector;
