import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import AvatarImage from './AvatarImage';

const styles = theme => ({
  centered: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacedEvenly: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

const ActiveArtist = props => {
  const { artist, classes, onAdd, onDismiss } = props;

  if (Object.keys(artist).length === 0) {
    return '';
  }

  return (
    <Card>
      <CardContent className={classes.centered}>
        <AvatarImage
          images={artist.images}
          alt={artist.name}
          fallback={<MusicNoteIcon style={{ fontSize: 120 }} />}
          imageSize="large"
        />
        <Typography variant="h2">{artist.name}</Typography>
      </CardContent>
      <CardActions className={classes.spacedEvenly}>
        <Button
          color="primary"
          startIcon={<PlaylistAddIcon />}
          onClick={() => onAdd()}
        >
          Add to queue
        </Button>
        <Button
          color="secondary"
          endIcon={<DeleteIcon />}
          onClick={() => onDismiss()}
        >
          Dismiss
        </Button>
      </CardActions>
    </Card>
  );
};

ActiveArtist.propTypes = {
  artist: PropTypes.object.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default withStyles(styles)(ActiveArtist);
