import React, { ReactNode } from 'react';
import { Avatar, useTheme } from '@mui/material';
import { TImage } from '../types/types';

interface AvatarImageProps {
  images: TImage[] | undefined;
  alt: string;
  fallback: ReactNode;
  maxWidth: number;
  imageSize: 'large' | 'medium' | 'small';
}

const AvatarImage = ({
  images,
  alt,
  fallback,
  maxWidth,
  imageSize,
}: AvatarImageProps) => {
  const theme = useTheme();

  const image = images?.find((image) => image.width <= maxWidth);
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

export default AvatarImage;
