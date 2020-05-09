import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
	Autocomplete,
} from '@material-ui/lab';
import {
  TextField,
  Typography,
  Avatar,
} from '@material-ui/core';
import AlbumIcon from '@material-ui/icons/Album';

const styles = theme => ({
  image: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    marginRight: theme.spacing(2),
  },
});

class AlbumInput extends Component {
	constructor(props) {
    super(props);
  }
  
  handleInputChange = (e, value) => {
    console.log('onChange', value);
  }

  getImage = (album) => {
    const { classes } = this.props;
    const image = album.images.find(image => image.width <= 300);
    if (image) {
      return <Avatar alt={album.name} src={image.url} className={classes.image} />
    }
    return <Avatar className={classes.image}><AlbumIcon /></Avatar>
  }

  getYear = (dateString) => {
    return new Date(dateString).getFullYear();
  }

  renderAlbum = (album) => (
    <React.Fragment>
      {this.getImage(album)}
      <Typography variant="subtitle1">{ album.name } <small>({ this.getYear(album.release_date) })</small></Typography>
    </React.Fragment>
  )

	render = () => {
    const { showInput, albums } = this.props;
    if (!showInput) {
      return (null);
    }
    if (Object.keys(albums).length === 0) {
      return (<Typography variant="subtitle1">No albums found.</Typography>)
    }
    return (
      <Autocomplete
        id="album-search"
        options={albums}
        getOptionLabel={album => album.name}
        renderOption={album => this.renderAlbum(album)}
        renderInput={params => <TextField {...params} label="Select album" variant="outlined" fullWidth />}
        onChange={this.handleInputChange}
      />
    )
	}
}

export default withStyles(styles)(AlbumInput);