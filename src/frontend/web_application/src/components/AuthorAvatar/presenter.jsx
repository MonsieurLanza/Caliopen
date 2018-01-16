import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ParticipantIconLetter from '../ParticipantIconLetter';
import './style.scss';

const getAuthor = message => message.participants.find(participant => participant.type === 'From');

class AuthorAvatar extends PureComponent {
  static propTypes = {
    message: PropTypes.shape({}).isRequired,
    isSelected: PropTypes.bool,
  };
  static defaultProps = {
    isSelected: false,
  };

  render() {
    const { isSelected } = this.props;
    const participant = getAuthor(this.props.message);

    return (
      <div className="m-author-avatar">
        <ParticipantIconLetter className="m-author-avatar__letter" isSelected={isSelected} participant={participant} />
      </div>
    );
  }
}

export default AuthorAvatar;
