import { createSelector } from 'reselect';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withI18n } from 'lingui-react';
import { withUser } from '../../hoc/user';
import { withNotification } from '../../hoc/notification';
import Presenter from './presenter';
import { filterTimeline } from '../../store/actions/timeline';
import { replyToMessage, deleteMessage, loadMore, hasMore } from '../../store/modules/message';
import { clearDraft } from '../../store/modules/draft-message';
import { timelineFilterSelector } from '../../store/selectors/timeline';

const timelineSelector = createSelector([
  state => state.message.messagesCollections.timeline,
  timelineFilterSelector,
], (collection, timelineFilter) => collection && collection[timelineFilter]);
const messagesSelector = state => state.message.messagesById;

const onDeleteMessage = ({ message }) => dispatch =>
  dispatch(deleteMessage({ message }))
    .then(() => {
      if (!message.is_draft) {
        return undefined;
      }

      return dispatch(clearDraft({ internalId: message.discussion_id }));
    });


const mapStateToProps = createSelector(
  [timelineSelector, messagesSelector, timelineFilterSelector],
  (timeline, messagesById, timelineFilter) => ({
    messages: timeline && timeline.messages.map(id => messagesById[id])
      .sort((a, b) => new Date(b.date_insert) - new Date(a.date_insert)),
    hasMore: timeline && hasMore(timeline),
    isFetching: timeline && timeline.isFetching,
    didInvalidate: timeline && timeline.didInvalidate,
    timelineFilter,
  })
);
const mapDispatchToProps = dispatch => bindActionCreators({
  requestMessages: filterTimeline,
  loadMore: loadMore.bind(null, 'timeline'),
  replyToMessage,
  deleteMessage: onDeleteMessage,
}, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withUser(),
  withNotification(),
  withI18n()
)(Presenter);
