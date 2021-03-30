import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Fade,
  TextField,
} from '@material-ui/core';

const styles = theme => ({
  input: {
    textAlign: 'center',
    fontSize: 60,
    fontFamily: theme.typography.headingFontFamily,
    color: theme.palette.primary.main,
  },
});

const ArtistInput = props => {
  const { classes, artistQuery, showInput, onInputChange } = props;

  if (!showInput) {
    return '';
  }

  return (
    <Fade in={true} timeout={{ enter: 0, exit: 2000 }}>
      <TextField
        id="artist-search"
        placeholder="Search artist"
        color="primary"
        autoFocus
        fullWidth
        value={artistQuery}
        onChange={onInputChange}
        inputProps={{
          className: classes.input,
          autoComplete: 'off',
        }}
      />
    </Fade>
  );
};

ArtistInput.propTypes = {
  artistQuery: PropTypes.string,
  showInput: PropTypes.bool,
  onInputChange: PropTypes.func,
};

export default withStyles(styles)(ArtistInput);
