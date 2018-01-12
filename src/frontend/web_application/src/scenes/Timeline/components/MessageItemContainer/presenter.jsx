import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Trans } from 'lingui-react';
import Modal from '../../../../components/Modal';
import { ManageEntityTags } from '../../../../modules/tags';

import './style.scss';

class MessageItemContainer extends Component {
  static propTypes = {
    message: PropTypes.shape({}).isRequired,
    children: PropTypes.node.isRequired,
    i18n: PropTypes.shape({}).isRequired,
    replyToMessage: PropTypes.func.isRequired,
    deleteMessage: PropTypes.func.isRequired,
  };

  state = {
    isTagModalOpen: false,
  };

  handleOpenTags = () => {
    this.setState(prevState => ({
      ...prevState,
      isTagModalOpen: true,
    }));
  }

  handleCloseTags = () => {
    this.setState(prevState => ({
      ...prevState,
      isTagModalOpen: false,
    }));
  }

  handleReply = () => {
    const { replyToMessage, message } = this.props;
    replyToMessage({ internalId: message.discussion_id, message });
  }

  handleDelete = () => {
    const { deleteMessage, message } = this.props;
    deleteMessage({ message });
  }

  handleSwipeLeft = () => {
    this.setState(prevState => ({
      ...prevState,
      isActive: true,
      isSwiped: true,
    }));
  }

  handleSwipeRight = () => {
    this.setState(prevState => ({
      ...prevState,
      isActive: prevState.isTagModalOpen === true ? prevState.isActive : false,
      isSwiped: prevState.isTagModalOpen === true ? prevState.isSwiped : false,
    }));
  }

  handleHover = () => {
    this.setState(prevState => ({
      ...prevState,
      isActive: prevState.isSwiped ? prevState.isActive : true,
    }));
  }

  handleBlur = () => {
    this.setState((prevState) => {
      const isActive = prevState.isSwiped ? false : prevState.isActive;

      return {
        ...prevState,
        isActive: prevState.isTagModalOpen === true ? isActive : false,
      };
    });
  }

  renderTagsModal = () => {
    const { message, i18n } = this.props;
    const nb = message.tags ? message.tags.length : 0;
    const title = (
      <Trans
        id="tags.header.title"
        defaults={'Tags <0>(Total: {nb})</0>'}
        values={{ nb }}
        components={[
          (<span className="m-tags-form__count" />),
        ]}
      />
    );

    return (
      <Modal
        isOpen={this.state.isTagModalOpen}
        contentLabel={i18n._('tags.header.label', { defaults: 'Tags' })}
        title={title}
        onClose={this.handleCloseTags}
      >
        <ManageEntityTags type="message" entity={message} />
      </Modal>
    );
  }

  render() {
    const { children } = this.props;

    return (
      <div
        className={classnames(
          'm-message-item-container',
          { 'm-message-item-container--active': this.state.isActive },
        )}
      >
        {children}
      </div>
    );
  }
}

export default MessageItemContainer;
