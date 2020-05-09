import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import MusicNoteIcon from '@material-ui/icons/MusicNote';

const styles = theme => ({
  chip: {
    margin: theme.spacing(.25),
    '&:first-child': {
      marginLeft: 0,
    },
  },
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
  largeImage: {
    width: theme.spacing(25),
    height: theme.spacing(25),
  },
});

class Artist extends Component {

  handleClick = () => {
    const { artist, onSelectArtist } = this.props;
    onSelectArtist(artist);
  }

  handleDismiss = () => {
    const { onDismiss } = this.props;
    onDismiss();
  }

  getImage = () => {
    const { artist, type, classes } = this.props;
    const image = artist.images.find(image => image.width <= 300);
    if (image) {
      return <Avatar alt={artist.name} src={image.url} className={type === "block" ? classes.largeImage : ''} />
    }
    return <Avatar><MusicNoteIcon /></Avatar>
  }

  getGenres = () => {
    const { artist, classes } = this.props;
    return artist.genres.slice(0, 3).map(genre => {
      return <Chip
        key={genre}
        label={genre}
        size="small"
        variant="outlined"
        color="primary"
        component="span"
        className={classes.chip} />
    });
  }

  renderAsListItem = () => {
    const { artist } = this.props;
    return (
      <ListItem button component="a" onClick={this.handleClick}>
        <ListItemAvatar>
          { this.getImage() }
        </ListItemAvatar>
        <ListItemText
          primary={artist.name}
          secondary={ this.getGenres() } />
      </ListItem>
    )
  }

  renderAsBlock = () => {
    const { artist, classes } = this.props;
    return (
      <Card>
        <CardContent className={classes.centered}>
          { this.getImage() }
          <Typography variant="h2">{ artist.name }</Typography>
        </CardContent>
        <CardActions className={classes.spacedEvenly}>
          <Button
            color="primary"
            startIcon={<PlaylistAddIcon />}>
              Add to list
          </Button>
          <Button
            color="secondary"
            endIcon={<DeleteIcon />}
            onClick={this.handleDismiss}>
              Dismiss
          </Button>
        </CardActions>
      </Card>
    )
  }

	render = () => {
    const { artist, type } = this.props;
    if (Object.keys(artist).length === 0) {
      return (null);
    }
    if (type === 'list') {
      return this.renderAsListItem();
    }
    return this.renderAsBlock();
  }
}

export default withStyles(styles)(Artist);