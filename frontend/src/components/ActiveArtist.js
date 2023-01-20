import React from 'react';
import PropTypes from 'prop-types';
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

const ActiveArtist = (props) => {
  const { artist, onAdd, onDismiss } = props;

  if (Object.keys(artist).length === 0) {
    return '';
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

ActiveArtist.propTypes = {
  artist: PropTypes.object.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default ActiveArtist;
