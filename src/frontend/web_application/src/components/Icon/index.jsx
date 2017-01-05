import React, { PropTypes } from 'react';
import classnames from 'classnames';
import './style.scss';

export const typeAssoc = {
  search: 'fa fa-search',
  user: 'fa fa-user',
  'caret-up': 'fa fa-caret-up',
  'caret-down': 'fa fa-caret-down',
  envelope: 'fa fa-envelope',
  comment: 'fa fa-comment',
  comments: 'fa fa-comments',
  'comments-o': 'fa fa-comments-o',
  users: 'fa fa-users',
  plus: 'fa fa-plus',
  reply: 'fa fa-reply',
  paperclip: 'fa fa-paperclip',
  at: 'fa fa-at',
  edit: 'fa fa-edit',
  check: 'fa fa-check',
  key: 'fa fa-key',
  'info-circle': 'fa fa-info-circle',
  remove: 'fa fa-remove',
  plug: 'fa fa-plug',
  phone: 'fa fa-phone',
  'map-marker': 'fa fa-map-marker',
};


const Icon = ({ className, type, spaced, ...props }) => {
  // eslint-disable-next-line no-console
  const typeClassName = typeAssoc[type] || console.error(`The type "${type}" is not a valid Icon component type`);
  const iconProps = {
    ...props,
    className: classnames(
      className,
      typeClassName,
      { 'm-icon--spaced': spaced }
    ),
  };

  return <i {...iconProps} />;
};

Icon.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  spaced: PropTypes.bool,
};

export default Icon;
