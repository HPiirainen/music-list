import React, { Key } from 'react';
import {
  Box,
  Fade,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AvatarImage from './AvatarImage';
import GenreList from './GenreList';
import { TArtist } from '../types/types';

interface ArtistResultListItemProps {
  key: Key | null | undefined;
  artist: TArtist;
  showGenres: boolean;
  onSelectArtist?: (artist: TArtist) => void;
}

const ArtistResultListItem: React.FC<ArtistResultListItemProps> = ({
  artist,
  showGenres,
  onSelectArtist,
}) => {
  if (Object.keys(artist).length === 0) {
    return null;
  }
  const secondaryContent = showGenres ? (
    <GenreList genres={artist.genres} showN={3} />
  ) : null;
  const content = (
    <>
      <ListItemAvatar>
        <Box mr={2}>
          <AvatarImage
            images={artist.images}
            alt={artist.name}
            imageSize="medium"
            fallback={<MusicNoteIcon sx={{ fontSize: 42 }} />}
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
          <ListItemButton onClick={() => onSelectArtist(artist)}>
            {content}
          </ListItemButton>
        </Box>
      </Fade>
    );
  }
  return (
    <Fade in={true}>
      <ListItem>{content}</ListItem>
    </Fade>
  );
};

export default ArtistResultListItem;
