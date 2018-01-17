import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans, Plural } from 'lingui-react';
import Button from '../../../../components/Button';

import './style.scss';

class MessageSelector extends Component {
  static propTypes = {
    onSelectAllMessages: PropTypes.func,
    count: PropTypes.number,
    totalCount: PropTypes.number,
    indeterminate: PropTypes.bool,
    checked: PropTypes.bool,
  };

  static defaultProps = {
    onSelectAllMessages: str => str,
    count: 0,
    totalCount: 0,
    indeterminate: false,
    checked: false,
  };

  componentDidMount() {
    this.selector.indeterminate = this.props.indeterminate;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.indeterminate !== this.props.indeterminate) {
      this.selector.indeterminate = this.props.indeterminate;
    }
  }

  toggleCheckbox = (ev) => {
    const { checked } = ev.target;
    this.props.onSelectAllMessages(checked);
  }

  handleEditTags = () => {
  }

  handleDelete = () => {
  }

  render() {
    const { count, totalCount, checked } = this.props;

    return (
      <div className="m-message-selector">
        {count !== 0 && (
          <span className="m-message-selector__title">
            <Plural
              id="message-list.message.selected"
              value={{ count, totalCount }}
              one={<Trans>{count}/{totalCount} message:</Trans>}
              other={<Trans>{count}/{totalCount} messages:</Trans>}
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
            defaultChecked={checked}
            onChange={this.toggleCheckbox}
            ref={el => (this.selector = el)}
          />
        </span>
      </div>
    );
  }
}

export default MessageSelector;
