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

  debounceInputChange = value => {
    const { onInputChange } = this.props;
    this.setState({
      query: value,
    });
    if (!this.debounceFn) {
      this.debounceFn = debounce(() => {
        onInputChange(this.state.query);
        console.log(this.state.query);
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
        onChange={({target: {value}}) => this.debounceInputChange(value)}
      />
    )
	}
}

ArtistInput.propTypes = {
  showInput: PropTypes.bool,
  onInputChange: PropTypes.func,
}

export default ArtistInput;