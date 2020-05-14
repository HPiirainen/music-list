import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Avatar,
} from '@material-ui/core';

const styles = theme => ({
  large: {
    width: theme.spacing(25),
    height: theme.spacing(25),
  },
  medium: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    marginRight: theme.spacing(2),
  },
});

class AvatarImage extends Component {

	render = () => {
    const { images, alt, fallback, maxWidth, imageSize, classes } = this.props;
    const image = images.find(image => image.width <= maxWidth);
    if (!image) {
      return <Avatar className={classes[imageSize]}>{ fallback }</Avatar>;
    }
    return (
      <Avatar alt={alt} src={image.url} className={classes[imageSize]} />
    )
  }
}

AvatarImage.defaultProps = {
  maxWidth: 300,
  imageSize: 'small',
}

AvatarImage.propTypes = {
  alt: PropTypes.string.isRequired,
  fallback: PropTypes.element.isRequired,
  maxWidth: PropTypes.number,
  imageSize: PropTypes.string,
}

export default withStyles(styles)(AvatarImage);