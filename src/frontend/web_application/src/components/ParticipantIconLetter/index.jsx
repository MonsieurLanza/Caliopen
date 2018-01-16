import React from 'react';
import PropTypes from 'prop-types';
import IconLetter from '../IconLetter';

function getParticipantTitle(participant) {
  return participant.label || participant.address;
}

const ParticipantIconLetter = ({ participant, isSelected, ...props }) => (
  <IconLetter word={getParticipantTitle(participant)} isSelected={isSelected} {...props} />
);

ParticipantIconLetter.propTypes = {
  participant: PropTypes.shape({}).isRequired,
  isSelected: PropTypes.bool.isRequired,
};

export default ParticipantIconLetter;
