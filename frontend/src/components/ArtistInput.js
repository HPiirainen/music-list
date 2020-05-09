import React, { Component } from 'react';
import {
	TextField,
} from '@material-ui/core';

class ArtistInput extends Component {
	constructor(props) {
    super(props);
    this.state = {
      query: '',
    };
  }

  clearQuery = () => {
    this.setState({
      query: '',
    });
  }
  
  handleInputChange = (e) => {
    const query = e.target.value;
    this.setState({
      query,
    }, () => {
      this.props.onInputChange(query);
    });
  }

	render = () => {
    const { showInput } = this.props;
    if (!showInput) {
      return (null);
    }
    return (
      <TextField
        id="artist-search"
        label="Search for artist"
        variant="outlined"
        fullWidth
        value={this.state.query}
        onChange={this.handleInputChange}
      />
    )
	}
}

export default ArtistInput;