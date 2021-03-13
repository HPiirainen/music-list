import React from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import AvatarImage from './AvatarImage';
import GenreList from './GenreList';

const ArtistResultListItem = props => {
  const { artist, onSelectArtist } = props;

  console.log('Render: ArtistResultListItem');

  if (Object.keys(artist).length === 0) {
    return '';
  }
  return (
    <ListItem button component="a" onClick={() => onSelectArtist(artist)}>
      <ListItemAvatar>
        <AvatarImage
          images={artist.images}
          alt={artist.name}
          imageSize="medium"
          fallback={<MusicNoteIcon style={{ fontSize: 42 }} />}
        />
      </ListItemAvatar>
      <ListItemText
        primary={artist.name}
        secondary={<GenreList genres={artist.genres} showN={3} />}
      />
    </ListItem>
  );
};

ArtistResultListItem.propTypes = {
  artist: PropTypes.object.isRequired,
  onSelectArtist: PropTypes.func.isRequired,
};

export default ArtistResultListItem;
