import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Fade,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AvatarImage from './AvatarImage';
import GenreList from './GenreList';

const ArtistResultListItem = props => {
  const { artist, showGenres, onSelectArtist } = props;

  if (Object.keys(artist).length === 0) {
    return '';
  }
  const secondaryContent = showGenres ? <GenreList genres={artist.genres} showN={3} /> : null;
  const content = (
    <>
      <ListItemAvatar>
        <Box mr={2}>
          <AvatarImage
            images={artist.images}
            alt={artist.name}
            imageSize="medium"
            fallback={<MusicNoteIcon style={{ fontSize: 42 }} />}
          />
        </Box>
      </ListItemAvatar>
      <ListItemText
        primary={artist.name}
        primaryTypographyProps={{ variant: 'h6' }}
        color="primary"
        secondary={secondaryContent}
      />
    </>
  );
  if (onSelectArtist) {
    return (
      <Fade in={true}>
        <Box component="li">
          <ListItem button component="a" onClick={() => onSelectArtist(artist)}>
            {content}
          </ListItem>
        </Box>
      </Fade>
    )
  }
  return (
    <Fade in={true}>
      <ListItem>
        {content}
      </ListItem>
    </Fade>
  );
};

ArtistResultListItem.propTypes = {
  artist: PropTypes.object.isRequired,
  showGenres: PropTypes.bool.isRequired,
  onSelectArtist: PropTypes.func,
};

export default ArtistResultListItem;
