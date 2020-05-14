import React, { Component } from 'react';
import { debounce } from 'lodash';
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
    // Tell React not to nullify event
    e.persist();
    const { onInputChange } = this.props;
    this.setState({
      query: e.target.value,
    });
    // Debounce sending input change to root component
    if (!this.debounceFn) {
      this.debounceFn = debounce(() => {
        onInputChange(e.target.value);
      }, 400);
    }
    this.debounceFn();
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