import React from 'react';
import PropTypes from 'prop-types';
import { Autocomplete } from '@mui/material';
import { Box, Fade, TextField, Typography } from '@mui/material';
import AlbumIcon from '@mui/icons-material/Album';
import AvatarImage from './AvatarImage';

const AlbumInput = (props) => {
  const { showInput, albums, onSelectAlbum } = props;

  const getYear = (dateString) => new Date(dateString).getFullYear();

  const renderAlbum = (props, album) => {
    return (
      <li {...props}>
        <AvatarImage
          images={album.images}
          alt={album.name}
          fallback={<AlbumIcon sx={{ fontSize: 42 }} />}
          imageSize="medium"
        />
        <Box ml={2}>
          <Typography variant="subtitle1">
            {album.name} <small>({getYear(album.release_date)})</small>
          </Typography>
        </Box>
      </li>
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
        getOptionLabel={(album) => album.name}
        renderOption={(props, album) => (
          <Box component="li" key={album.id} {...props}>
            <AvatarImage
              images={album.images}
              alt={album.name}
              fallback={<AlbumIcon sx={{ fontSize: 42 }} />}
              imageSize="medium"
            />
            <Box ml={2}>
              <Typography variant="subtitle1">
                {album.name} <small>({getYear(album.release_date)})</small>
              </Typography>
            </Box>
          </Box>
        )}
        renderInput={(params) => (
          <TextField {...params} label="Select album" fullWidth />
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
