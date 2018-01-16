import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import getClassName from './services/stylesheet-helper';
import './style.scss';

const IconLetter = ({ word, className, isSelected }) => (
  <span className={classnames(className, isSelected ? 'm-letter--checked' : getClassName(word))} />
);

IconLetter.propTypes = {
  word: PropTypes.string,
  className: PropTypes.string,
  isSelected: PropTypes.bool,
};

IconLetter.defaultProps = {
  word: null,
  className: null,
  isSelected: false,
};

export default IconLetter;
