import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withI18n } from 'lingui-react';
import { push } from 'react-router-redux';
import { createNotification, NOTIFICATION_TYPE_INFO } from 'react-redux-notify';
import { createMessageCollectionStateSelector } from '../../store/selectors/message';
import { requestMessages, postActions, deleteMessage, loadMore, replyToMessage } from '../../store/modules/message';
import { removeTab, updateTab } from '../../store/modules/tab';
import { clearDraft } from '../../store/modules/draft-message';
import { updateTagCollection, withTags } from '../../modules/tags';
import { withCurrentTab } from '../../hoc/tab';
import Presenter from './presenter';

const getDiscussionIdFromProps = props => props.match.params.discussionId;

const messageByIdSelector = state => state.message.messagesById;
const discussionIdSelector = (state, ownProps) => getDiscussionIdFromProps(ownProps);
const messageCollectionStateSelector = createMessageCollectionStateSelector(() => 'discussion', discussionIdSelector);

const mapStateToProps = createSelector(
  [messageByIdSelector, discussionIdSelector, messageCollectionStateSelector],
  (messagesById, discussionId, {
    didInvalidate, messageIds, hasMore, isFetching,
  }) => {
    const messages = messageIds.map(messageId => messagesById[messageId]);

    return {
      discussionId,
      didInvalidate,
      isFetching,
      hasMore,
      messages,
    };
  }
);

// customStyles applied to Notification component
const customStyles = {
  'has-close': 'l-notification-center__notification--has-close',
  'has-close-all': 'l-notification-center__notification--has-close-all',
  item__message: 'l-notification-center__notification-item-message',
};

const notif = createNotification({
  message: 'Functionnality is not yet available',
  type: NOTIFICATION_TYPE_INFO,
  duration: 10000,
  canDismiss: true,
  customStyles,
});

const onDeleteMessage = ({ message }) => dispatch =>
  dispatch(deleteMessage({ message }))
    .then(() => {
      if (!message.is_draft) {
        return undefined;
      }

      return dispatch(clearDraft({ internalId: message.discussion_id }));
    });

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators({
  requestMessages: requestMessages.bind(null, 'discussion', getDiscussionIdFromProps(ownProps)),
  loadMore: loadMore.bind(null, 'discussion', getDiscussionIdFromProps(ownProps)),
  deleteMessage: onDeleteMessage,
  setMessageRead: ({ message, isRead = true }) => {
    const action = isRead ? 'set_read' : 'set_unread';

    return postActions({ message, actions: [action] });
  },
  removeTab,
  updateTab,
  replyToMessage,
  copyMessageTo: () => notif,
  push,
  updateTagCollection,
}, dispatch);

export default compose(
  withTags(),
  connect(mapStateToProps, mapDispatchToProps),
  withI18n(),
  withCurrentTab()
)(Presenter);
