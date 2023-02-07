import React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Fade,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import AvatarImage from './AvatarImage';
import { TArtist } from '../types/types';

interface ActiveArtistProps {
  artist: TArtist | undefined;
  onAdd: (listId?: string | null) => void;
  onDismiss: () => void;
}

const ActiveArtist: React.FC<ActiveArtistProps> = ({
  artist,
  onAdd,
  onDismiss,
}) => {
  if (typeof artist === 'undefined') {
    return null;
  }

  return (
    <Fade in={true} timeout={1000}>
      <Card>
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <AvatarImage
            images={artist.images}
            alt={artist.name}
            fallback={<MusicNoteIcon sx={{ fontSize: 120 }} />}
            imageSize="large"
          />
          <Typography variant="h2">{artist.name}</Typography>
        </CardContent>
        <CardActions
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Button
            color="primary"
            variant="contained"
            startIcon={<PlaylistAddIcon />}
            onClick={() => onAdd()}
          >
            Add to queue
          </Button>
          <Button
            color="secondary"
            variant="contained"
            endIcon={<DeleteIcon />}
            onClick={() => onDismiss()}
          >
            Dismiss
          </Button>
        </CardActions>
      </Card>
    </Fade>
  );
};

export default ActiveArtist;
