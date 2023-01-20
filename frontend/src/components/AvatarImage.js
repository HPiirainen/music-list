import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, useTheme } from '@mui/material';

const AvatarImage = (props) => {
  const { images, alt, fallback, maxWidth, imageSize } = props;
  const theme = useTheme();

  const image = images.find((image) => image.width <= maxWidth);
  const imageStyle = {
    width: theme.spacing(imageSize === 'large' ? 25 : 10),
    height: theme.spacing(imageSize === 'large' ? 25 : 10),
  };

  if (!image) {
    return <Avatar sx={imageStyle}>{fallback}</Avatar>;
  }
  return <Avatar alt={alt} src={image.url} sx={imageStyle} />;
};

AvatarImage.defaultProps = {
  maxWidth: 768,
  imageSize: 'small',
};

AvatarImage.propTypes = {
  alt: PropTypes.string.isRequired,
  fallback: PropTypes.element.isRequired,
  maxWidth: PropTypes.number,
  imageSize: PropTypes.string,
};

export default AvatarImage;
