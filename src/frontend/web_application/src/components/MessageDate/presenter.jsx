import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import './style.scss';

class MessageDate extends PureComponent {
  static propTypes = {
    dateTime: PropTypes.instanceOf(Moment).isRequired,
  };
  static defaultProps = {
  };

  render() {
    const { dateTime } = this.props;

    return (
      <time
        title={dateTime.format('LLL')}
        dateTime={dateTime.format('')}
      >
        <span className="m-message-date__date">{dateTime.format('L')}</span>
        {' '}
        <span className="m-message-date__time">{dateTime.format('LT')}</span>
      </time>
    );
  }
}

export default MessageDate;
