import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
} from '@material-ui/core';
import MusicList from './MusicList';

class MusicListContainer extends Component {

	render = () => {
    const { lists, onMoveItem } = this.props;
    const content = lists.map(list => (
      <MusicList
        key={list.id}
        list={list}
        onMoveItem={onMoveItem} />
    ));
    return (
      <Box my={4}>
        { content }
      </Box>
    )
  }
}

MusicListContainer.propTypes = {
  lists: PropTypes.arrayOf(PropTypes.object).isRequired,
  onMoveItem: PropTypes.func,
}

export default MusicListContainer;