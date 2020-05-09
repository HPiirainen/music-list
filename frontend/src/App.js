import React, { Component } from 'react';
import {
  Container,
  Box,
} from '@material-ui/core';
import axios from 'axios';
import ArtistInput from './components/ArtistInput';
import ArtistList from './components/ArtistList';
import Artist from './components/Artist';
import AlbumInput from './components/AlbumInput';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeArtist: {},
      artistResults: {},
      albums: {},
      loading: false,
      message: '',
    };
    this.cancel = '';
    this.artistInput = React.createRef();
  }

  getApiBaseUrl = () => {
    return 'http://localhost:5001/music-app-a2bd9/us-central1/app';
  }

  fetchArtists = (query) => {
    if (this.cancel) {
      this.cancel.cancel();
    }
    this.cancel = axios.CancelToken.source();
    if (query.length === 0) {
      this.setState({ artistResults: {} });
      return;
    }
    const artistSearchUrl = `${this.getApiBaseUrl()}/spotify/search-artist/${query}`;
    axios
      .get(
        artistSearchUrl,
        { cancelToken: this.cancel.token }
      )
      .then(response => {
        console.log(response.data);
        this.setState({
          artistResults: response.data,
          message: '',
        });
      })
      .catch(error => {
        if (axios.isCancel(error) || error) {
          this.setState({
            message: 'Failed to fetch results. Please try again.',
          });
        }
      });
  }

  fetchArtistAlbums = () => {
    const { activeArtist } = this.state;
    if (this.cancel) {
      this.cancel.cancel();
    }
    this.cancel = axios.CancelToken.source();
    this.setState({loading: true});
    const albumSearchUrl = `${this.getApiBaseUrl()}/spotify/get-artist-albums/${activeArtist.id}`;
    axios
      .get(
        albumSearchUrl,
        { cancelToken: this.cancel.token }
      )
      .then(response => {
        console.log(response.data);
        this.setState({
          albums: response.data,
          loading: false,
          message: '',
        })
      })
      .catch(error => {
        if (axios.isCancel(error) || error) {
          this.setState({
            loading: false,
            message: 'Failed to fetch results. Please try again.',
          });
        }
      });
  }

  setArtist = (artist) => {
    this.setState({
      activeArtist: artist,
      artistResults: {},
    }, () => {
      this.fetchArtistAlbums();
    });
    this.artistInput.current.clearQuery();
  }

  clearActiveArtist = () => {
    this.setState({
      activeArtist: {},
    });
  }

  isArtistInputVisible = () => {
    const { activeArtist } = this.state;
    return Object.keys(activeArtist).length === 0;
  }

  isAlbumInputVisible = () => {
    const { activeArtist, loading } = this.state;
    return Object.keys(activeArtist).length && !loading;
  }

  renderArtists = () => {
    const { artistResults } = this.state;

    if (Object.keys(artistResults) && artistResults.length) {
      return (
        <Box my={2}>
          { artistResults.map(result => (
            <p key={result.id} onClick={this.setArtist}>{ result.name }</p>
          ))}
        </Box>
      )
    }
  }

  render = () => (
    <Container maxWidth="sm" className="app">
      <Box my={4}>
        <ArtistInput
          ref={this.artistInput}
          showInput={this.isArtistInputVisible()}
          onInputChange={this.fetchArtists} />
        <ArtistList
          artists={this.state.artistResults}
          onSelectArtist={this.setArtist} />
        <Artist
          type="block"
          artist={this.state.activeArtist}
          onDismiss={this.clearActiveArtist} />
        <Box my={2}>
          <AlbumInput
            albums={this.state.albums}
            showInput={this.isAlbumInputVisible()} />
        </Box>
      </Box>
    </Container>
  )
}

export default App;
