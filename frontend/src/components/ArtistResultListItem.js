import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Fade,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@material-ui/core';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import AvatarImage from './AvatarImage';
import GenreList from './GenreList';

const ArtistResultListItem = props => {
  const { artist, onSelectArtist } = props;

  if (Object.keys(artist).length === 0) {
    return '';
  }
  return (
    <Fade in={true}>
      <Box component="li">
        <ListItem button component="a" onClick={() => onSelectArtist(artist)}>
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
            secondary={<GenreList genres={artist.genres} showN={3} />}
          />
        </ListItem>
      </Box>
    </Fade>
  );
};

ArtistResultListItem.propTypes = {
  artist: PropTypes.object.isRequired,
  onSelectArtist: PropTypes.func.isRequired,
};

export default ArtistResultListItem;
