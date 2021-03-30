import React from 'react';
import PropTypes from 'prop-types';
import { Autocomplete } from '@material-ui/lab';
import {
  Box,
  Fade,
  TextField,
  Typography
} from '@material-ui/core';
import AlbumIcon from '@material-ui/icons/Album';
import AvatarImage from './AvatarImage';

const AlbumInput = props => {
  const { showInput, albums, onSelectAlbum } = props;

  const getYear = dateString => new Date(dateString).getFullYear();

  const renderAlbum = album => {
    return (
      <>
        <AvatarImage
          images={album.images}
          alt={album.name}
          fallback={<AlbumIcon style={{ fontSize: 42 }} />}
          imageSize="medium"
        />
        <Box ml={2}>
          <Typography variant="subtitle1">
            {album.name} <small>({getYear(album.release_date)})</small>
          </Typography>
        </Box>
      </>
    );
  };

  if (!showInput) {
    return '';
  }

  if (Object.keys(albums).length === 0) {
    return (
      <Fade in={true} timeout={500}>
        <Typography variant="body1">No albums found.</Typography>
      </Fade>
    );
  }

  return (
    <Fade in={true} timeout={500}>
      <Autocomplete
        id="album-search"
        options={albums}
        getOptionLabel={album => album.name}
        renderOption={album => renderAlbum(album)}
        renderInput={params => (
          <TextField
            {...params}
            label="Select album"
            variant="outlined"
            fullWidth
          />
        )}
        onChange={(e, value) => onSelectAlbum(value)}
      />
    </Fade>
  );
};

AlbumInput.propTypes = {
  albums: PropTypes.arrayOf(PropTypes.object).isRequired,
  showInput: PropTypes.bool,
  onSelectAlbum: PropTypes.func,
};

export default AlbumInput;
