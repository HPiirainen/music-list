import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

const ArtistInput = props => {
  const { artistQuery, showInput, onInputChange } = props;

  if (!showInput) {
    return '';
  }

  return (
    <TextField
      id="artist-search"
      label="Search for artist"
      variant="outlined"
      fullWidth
      value={artistQuery}
      onChange={onInputChange}
    />
  );
};

ArtistInput.propTypes = {
  artistQuery: PropTypes.string,
  showInput: PropTypes.bool,
  onInputChange: PropTypes.func,
};

export default ArtistInput;
