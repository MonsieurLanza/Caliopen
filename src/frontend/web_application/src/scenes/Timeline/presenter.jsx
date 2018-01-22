import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import { Trans } from 'lingui-react';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';
import PageTitle from '../../components/PageTitle';
import Button from '../../components/Button';
import BlockList from '../../components/BlockList';
import InfiniteScroll from '../../components/InfiniteScroll';
import MenuBar from '../../components/MenuBar';
import MessageSelector from './components/MessageSelector';
import MessageItem from './components/MessageItem';
import { isMessageFromUser } from '../../services/message';
import { WithTags, ManageEntityTags } from '../../modules/tags';

import './style.scss';

const LOAD_MORE_THROTTLE = 1000;

class Timeline extends Component {
  static propTypes = {
    user: PropTypes.shape({}),
    requestMessages: PropTypes.func.isRequired,
    deleteMessage: PropTypes.func.isRequired,
    timelineFilter: PropTypes.string.isRequired,
    loadMore: PropTypes.func.isRequired,
    messages: PropTypes.arrayOf(PropTypes.shape({})),
    isFetching: PropTypes.bool,
    didInvalidate: PropTypes.bool,
    hasMore: PropTypes.bool,
    i18n: PropTypes.shape({}).isRequired,
    notify: PropTypes.func.isRequired,
  };

  static defaultProps = {
    messages: [],
    user: undefined,
    isFetching: false,
    didInvalidate: false,
    hasMore: false,
  };

  state= {
    selectedMessages: [],
    isTagModalOpen: false,
  }

  componentDidMount() {
    const { requestMessages, timelineFilter, loadMore } = this.props;
    requestMessages(timelineFilter);

    this.throttledLoadMore = throttle(
      () => loadMore(timelineFilter),
      LOAD_MORE_THROTTLE,
      { trailing: false }
    );
  }

  componentWillReceiveProps(nextProps) {
    const { requestMessages, timelineFilter, didInvalidate, isFetching } = nextProps;
    if (didInvalidate && !isFetching) {
      requestMessages(timelineFilter);
    }
  }

  onSelectMessage = (type, messageId) => {
    if (type === 'add') {
      this.setState(prevState => ({
        ...prevState,
        selectedMessages: [...prevState.selectedMessages, messageId],
      }));
    }

    if (type === 'remove') {
      this.setState(prevState => ({
        ...prevState,
        selectedMessages: [...prevState.selectedMessages].filter(item => item !== messageId),
      }));
    }
  }

  onSelectAllMessages = (checked) => {
    const { messages } = this.props;
    const messagesIds = messages.map(message => message.message_id);

    this.setState(prevState => ({
      ...prevState,
      selectedMessages: checked ? messagesIds : [],
    }));
  }

  handleOpenTags = () => {
    if (this.state.selectedMessages.length > 1) {
      return this.props.notify({
        message: 'Edit multiple messages is not yet implemented.',
      });
    }

    return this.setState(prevState => ({
      ...prevState,
      isTagModalOpen: true,
    }));
  }

  handleCloseTags = () => {
    this.setState(prevState => ({
      ...prevState,
      isTagModalOpen: false,
      selectedMessages: [],
    }));
  }

  handleDeleteMessages = () => {
    // TODO: implement multiple message deletion
    if (this.state.selectedMessages.length > 1) {
      return this.props.notify({
        message: 'Delete multiple messages is not yet implemented.',
      });
    }

    const { messages } = this.props;
    const selectedMessageId = this.state.selectedMessages[0];

    const message = messages.find(
      item => item.message_id === selectedMessageId
    );

    return this.props.deleteMessage({ message });
  }

  loadMore = () => {
    if (this.props.hasMore) {
      this.throttledLoadMore();
    }
  }

  renderList = ({ userTags }) => {
    const { user, messages } = this.props;

    return (
      <BlockList className="s-timeline__list">
        {messages.map(message => (
          <MessageItem
            key={message.message_id}
            userTags={userTags}
            isMessageFromUser={(user && isMessageFromUser(message, user)) || false}
            message={message}
            onSelectMessage={this.onSelectMessage}
            isMessageSelected={[...this.state.selectedMessages].includes(message.message_id)}
          />
        ))}
      </BlockList>
    );
  }

  renderTagsModal = () => {
    const { messages, i18n } = this.props;
    // TODO: implement multiple messages tags edition
    const selectedMessageId = this.state.selectedMessages[0];
    const selectedMessage = messages.find(
      item => item.message_id === selectedMessageId
    );
    const nb = this.state.isTagModalOpen && selectedMessage.tags
      ? selectedMessage.tags.length
      : 0;
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
        {this.state.isTagModalOpen && (
          <ManageEntityTags type="message" entity={selectedMessage} />
        )}
      </Modal>
    );
  }

  render() {
    const { messages, isFetching, hasMore, i18n } = this.props;

    return (
      <div className="s-timeline">
        <PageTitle title={i18n._('header.menu.discussions', { defaults: 'Messages' })} />
        <MenuBar className="s-timeline__menu-bar">
          <Spinner isLoading={isFetching} className="s-timeline__spinner" />
          <div className="s-timeline__col-selector">
            <MessageSelector
              indeterminate={
                this.state.selectedMessages.length > 0
                && this.state.selectedMessages.length < messages.length
              }
              checked={
                this.state.selectedMessages.length === messages.length
                && this.state.selectedMessages.length > 0
              }
              count={this.state.selectedMessages.length}
              totalCount={messages.length}
              onSelectAllMessages={this.onSelectAllMessages}
              onEditTags={this.handleOpenTags}
              onDeleteMessages={this.handleDeleteMessages}
            />
          </div>
          {this.renderTagsModal()}
        </MenuBar>
        <InfiniteScroll onReachBottom={this.loadMore}>
          <WithTags render={userTags => this.renderList({ userTags })} />
        </InfiniteScroll>
        {hasMore && (
          <div className="s-timeline__load-more">
            <Button shape="hollow" onClick={this.loadMore}><Trans id="general.action.load_more">Load more</Trans></Button>
          </div>
        )}
      </div>
    );
  }
}

export default Timeline;
