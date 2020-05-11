import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Chip,
} from '@material-ui/core';

const styles = theme => ({
	chip: {
    margin: theme.spacing(.25),
    pointerEvents: 'none',
		'&:first-child': {
			marginLeft: 0,
	  },
	},
});

class Genre extends Component {

	render = () => {
    const { genre, classes } = this.props;
    return <Chip
      key={genre}
      label={genre}
      size="small"
      variant="outlined"
      color="primary"
      component="span"
      className={classes.chip} />
  }
}

Genre.propTypes = {
  genre: PropTypes.string.isRequired,
}

export default withStyles(styles)(Genre);