import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { Chip } from '@mui/material';

const styles = theme => ({
  chip: {
    margin: theme.spacing(0.25),
    pointerEvents: 'none',
    '&:first-child': {
      marginLeft: 0,
    },
  },
});

const Genre = props => {
  const { genre, classes } = props;
  return (
    <Chip
      key={genre}
      label={genre}
      size="small"
      color="primary"
      component="span"
      className={classes.chip}
    />
  );
};

Genre.propTypes = {
  genre: PropTypes.string.isRequired,
};

export default withStyles(styles)(Genre);
