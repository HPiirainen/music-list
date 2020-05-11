import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
	Autocomplete,
} from '@material-ui/lab';
import {
  TextField,
  Typography,
} from '@material-ui/core';
import AlbumIcon from '@material-ui/icons/Album';
import AvatarImage from './AvatarImage';

const styles = theme => ({
  
});

class AlbumInput extends Component {

  handleInputChange = (e, value) => {
    const { onSelectAlbum } = this.props;
    onSelectAlbum(value);
  }

  getYear = (dateString) => {
    return new Date(dateString).getFullYear();
  }

  renderAlbum = (album) => (
    <React.Fragment>
      <AvatarImage
        images={album.images}
        alt={album.name}
        fallback={<AlbumIcon style={{ fontSize: 42 }} />}
        imageSize="medium" />
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

AlbumInput.propTypes = {
  albums: PropTypes.arrayOf(PropTypes.object).isRequired,
  showInput: PropTypes.bool,
}

export default withStyles(styles)(AlbumInput);