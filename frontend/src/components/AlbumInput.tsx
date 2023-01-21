import React, { Dispatch, SetStateAction } from 'react';
import { Autocomplete } from '@mui/material';
import { Box, Fade, TextField, Typography } from '@mui/material';
import AlbumIcon from '@mui/icons-material/Album';
import AvatarImage from './AvatarImage';
import { TAlbum } from '../types/types';

interface AlbumInputProps {
  showInput: boolean;
  albums: TAlbum[];
  onSelectAlbum: Dispatch<SetStateAction<TAlbum | null>>;
}

const AlbumInput = ({ showInput, albums, onSelectAlbum }: AlbumInputProps) => {
  const getYear = (dateString: string | undefined) =>
    dateString ? new Date(dateString).getFullYear() : '';

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
          <Box component="li" {...props} key={album.id}>
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

export default AlbumInput;
