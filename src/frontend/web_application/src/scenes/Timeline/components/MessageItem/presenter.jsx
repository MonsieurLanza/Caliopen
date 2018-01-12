import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Moment from 'react-moment';
import { Trans } from 'lingui-react';
import Link from '../../../../components/Link';
import MessageDate from '../../../../components/MessageDate';
import AuthorAvatar from '../../../../components/AuthorAvatar';
import MessageItemContainer from '../MessageItemContainer';
import Icon from '../../../../components/Icon';
// import { CheckboxFieldGroup } from '../../../../components/form';
import TextBlock from '../../../../components/TextBlock';
import Badge from '../../../../components/Badge';
import { getTagLabel, getCleanedTagCollection } from '../../../../modules/tags';
import { renderParticipant, getAuthor } from '../../../../services/message';

import './style.scss';

class MessageItem extends Component {
  static propTypes = {
    i18n: PropTypes.shape({}).isRequired,
    message: PropTypes.shape({}).isRequired,
    settings: PropTypes.shape({}).isRequired,
    isMessageFromUser: PropTypes.bool.isRequired,
    userTags: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  };

  state = {
    isSelected: false,
  }

  onCheckboxChange = () => {
    this.setState(prevState => ({
      isSelected: !prevState.isSelected,
    }));
  }

  renderAuthor = () => {
    const author = getAuthor(this.props.message);

    return renderParticipant(author);
  }

  renderDate = () => {
    const { message, settings: { default_locale: locale }, isMessageFromUser } = this.props;
    const hasDate = (isMessageFromUser && message.date)
      || (!isMessageFromUser && message.date_insert);
    const msgDate = isMessageFromUser && !message.is_draft ? message.date : message.date_insert;

    return (
      <TextBlock className="s-message-item__col-dates">
        {hasDate &&
          <Moment className="m-message__date" locale={locale} element={MessageDate}>
            {msgDate}
          </Moment>
        }
      </TextBlock>
    );
  }

  renderTags = () => {
    const { userTags, message, i18n } = this.props;

    return message.tags && getCleanedTagCollection(userTags, message.tags).map(tag => (
      <span key={tag.name}>
        {' '}
        <Badge className="s-message-item__tag">{getTagLabel(i18n, tag)}</Badge>
      </span>
    ));
  }

  renderTitle = () => {
    const { message } = this.props;
    const hash = message.is_draft ? 'reply' : message.message_id;

    return (
      <div className="s-message-item__title-content" >
        <TextBlock className="s-message-item__title-author">
          {this.renderAuthor()}
          {this.renderTags()}
        </TextBlock>
        <TextBlock className="s-message-item__title-subject">
          <Link to={`/discussions/${message.discussion_id}#${hash}`} noDecoration >
            {message.is_draft && (<span className="s-message-item__draft-prefix"><Trans id="timeline.draft-prefix">Draft in progress:</Trans></span>)}
            {message.subject && (<span className="s-message-item__subject">{message.subject}</span>)}
            {message.excerpt}
          </Link>
        </TextBlock>
      </div>
    );
  }

  render() {
    const { message } = this.props;
    const { pi } = message;

    return (
      <MessageItemContainer message={message}>
        <div
          className={
            classnames('s-message-item',
              {
                's-message-item--unread': message.is_unread,
                's-message-item--draft': message.is_draft,
                's-message-item--is-selected': this.state.isSelected,
                's-message-item--pi-super': pi.context >= 90,
                's-message-item--pi-good': pi.context >= 50 && pi.context < 90,
                's-message-item--pi-bad': pi.context >= 25 && pi.context < 50,
                's-message-item--pi-ugly': pi.context >= 0 && pi.context < 25,
              })}
        >
          <div className="s-message-item__col-avatars">
            <AuthorAvatar message={message} />
          </div>
          <div className="s-message-item__col-title">
            {this.renderTitle()}
          </div>
          <div className="s-message-item__col-file">
            { message.attachments && <Icon type="paperclip" /> }
          </div>
          {this.renderDate()}
          <div className="s-message-item__col-select">
            <input type="checkbox" onChange={this.onCheckboxChange} />
          </div>
        </div>
      </MessageItemContainer>
    );
  }
}

export default MessageItem;
