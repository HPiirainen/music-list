import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    const { onInputChange } = this.props;
    const query = e.target.value;
    this.setState({
      query,
    }, () => {
      onInputChange(query);
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

ArtistInput.propTypes = {
  showInput: PropTypes.bool,
  onInputChange: PropTypes.func,
}

export default ArtistInput;