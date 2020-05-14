import React, { Component } from 'react';
import { groupBy } from 'lodash';
import update from 'immutability-helper';
import axios from 'axios';
import {
  Container,
  Box,
  List,
  Divider,
  Typography,
} from '@material-ui/core';
import ArtistInput from './components/ArtistInput';
import ArtistResultListItem from './components/ArtistResultListItem';
import ActiveArtist from './components/ActiveArtist';
import AlbumInput from './components/AlbumInput';
import MusicList from './components/MusicList';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [
        {
          id: 1,
          title: 'Queue',
          items: {},
        },
        {
          id: 2,
          title: 'History',
          items: {},
        },
        {
          id: 3,
          title: 'Long-term',
          items: {},
        }
      ],
      activeArtist: {},
      artistResults: [],
      activeAlbum: {},
      albums: [],
      loading: false,
      message: '',
    };
    this.cancel = '';
    this.artistInput = React.createRef();
  }

  componentDidMount = () => {
    this.loadListItems();
  }

  getApiBaseUrl = () => {
    return 'http://localhost:5001/music-app-a2bd9/us-central1/app';
  }

  loadListItems = () => {
    const { lists } = this.state;
    this.setState({ loading: true });
    const readAllItemsUrl = `${this.getApiBaseUrl()}/api/read-items`;
    axios.get(readAllItemsUrl)
      .then(response => {
        const itemsByListId = groupBy(response.data, 'listId');
        lists.forEach((list, key) => {
          const listIndex = Object.keys(itemsByListId).findIndex(id => parseInt(id) === list.id);
          if (listIndex >= 0) {
            this.setState({
              lists: update(this.state.lists, { [key]: { items: { $set: itemsByListId[list.id] } } }),
            });
          } else {
            this.setState({
              lists: update(this.state.lists, { [key]: { items: { $set: {} } } }),
            });
          }
        });
        this.setState({ loading: false });
      })
      .catch(error => {
        console.log(error);
        this.setState({ loading: false });
      });
  }

  deleteItem = (item) => {
    const { itemId } = item;
    const deleteItemUrl = `${this.getApiBaseUrl()}/api/delete-item/${itemId}`;
    this.setState({ loading: true });
    axios.delete(
      deleteItemUrl
    )
      .then(response => {
        this.loadListItems();
      })
      .catch(error => {
        console.log(error);
        this.setState({ loading: false });
      });
  }

  moveItemToList = (item, listId = 2) => {
    const { itemId } = item;
    const updateItemUrl = `${this.getApiBaseUrl()}/api/update-item/${itemId}`;
    this.setState({ loading: true });
    axios.put(
      updateItemUrl,
      { listId }
    )
      .then(response => {
        this.loadListItems();
      })
      .catch(error => {
        console.log(error);
        this.setState({ loading: false });
      });
  }

  readItem = async (id) => {
    const readItemUrl = `${this.getApiBaseUrl()}/api/read-item/${id}`;
    const item = await axios
      .get(readItemUrl)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
        return {};
      });
    return item;
  }

  fetchArtists = (query) => {
    console.log('actually fetching');
    if (this.cancel) {
      this.cancel.cancel();
    }
    this.cancel = axios.CancelToken.source();
    if (query.length === 0) {
      this.setState({ artistResults: [] });
      return;
    }
    const artistSearchUrl = `${this.getApiBaseUrl()}/spotify/search-artist/${query}`;
    axios
      .get(
        artistSearchUrl,
        { cancelToken: this.cancel.token }
      )
      .then(response => {
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
          message: '',
        })
      })
      .catch(error => {
        if (axios.isCancel(error) || error) {
          this.setState({
            message: 'Failed to fetch results. Please try again.',
          });
        }
      });
  }

  setArtist = (artist) => {
    this.setState({
      activeArtist: artist,
      artistResults: [],
    }, () => {
      this.fetchArtistAlbums();
    });
    this.artistInput.current.clearQuery();
  }

  setAlbum = (album) => {
    this.setState({
      activeAlbum: album,
      albums: [],
    }, () => {
      this.addActiveToList();
    });
  }

  constructItemFromState = () => {
    const {
      activeArtist: {
        id: artistId,
        name: artistName,
        href: artistUrl,
        images: artistImages,
        genres: artistGenres,
      },
      activeAlbum: {
        id: albumId,
        name: albumName,
        href: albumUrl,
        images: albumImages,
        release_date: albumReleaseDate,
        total_tracks: albumTracksAmount,
      },
    } = this.state || {};

    return {
      artistId,
      artistName,
      artistUrl,
      artistImages,
      artistGenres,
      albumId: albumId || null,
      albumName: albumName || null,
      albumUrl: albumUrl || null,
      albumImages: albumImages || null,
      albumReleaseDate: albumReleaseDate || null,
      albumTracksAmount: albumTracksAmount || null,
    };
  }

  appendItemToList = (item, listId = 1) => {
    const { lists } = this.state;
    const listIndex = lists.findIndex(list => list.id === listId);
    if (listIndex === -1) {
      return false;
    }
    this.setState({
      lists: update(this.state.lists, {[listIndex]: {items: {$push: [item]}}}),
    });
  }

  addActiveToList = (listId = 1) => {
    if (!this.hasActiveArtist()) {
      return;
    }
    const item = this.constructItemFromState();
    item.listId = listId;
    console.log(item);
    if (this.cancel) {
      this.cancel.cancel();
    }
    this.cancel = axios.CancelToken.source();
    this.setState({loading: true});
    const createItemUrl = `${this.getApiBaseUrl()}/api/create-item`;
    axios
      .post(
        createItemUrl,
        item,
        { cancelToken: this.cancel.token }
      )
      .then(response => {
        this.setState({
          loading: false,
          activeArtist: {},
          activeAlbum: {},
        }, () => {
          this.loadListItems();
        });
      })
      // .then(item => {
      //   this.appendItemToList(item, 1);
      // })
      .catch(error => {
        if (axios.isCancel(error) || error) {
          console.log(error);
          this.setState({
            loading: false,
            message: 'Failed to create item. Please try again.',
          });
        }
      });
  }

  hasActiveArtist = () => {
    const { activeArtist } = this.state;
    return Object.keys(activeArtist).length > 0;
  }

  clearActiveArtist = () => {
    this.setState({
      activeArtist: {},
    });
  }

  isArtistInputVisible = () => {
    return !this.hasActiveArtist();
  }

  isAlbumInputVisible = () => {
    const { loading } = this.state;
    return this.hasActiveArtist() && !loading;
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

  render = () => {
    const { artistResults, activeArtist, albums, lists, loading } = this.state;
    if (loading) {
      return (
        <Container maxWidth="sm" className="app">
          <Typography variant="h3">Loading...</Typography>
        </Container>
      )
    }
    const listContent = lists.map(list => (
      <MusicList key={list.id} list={list} onMoveItem={this.moveItemToList} onDeleteItem={this.deleteItem} />
    ));
    let artistContent = '';
    if (artistResults.length) {
      const artistElements = artistResults.map(artist => (
        <React.Fragment key={artist.id}>
          <ArtistResultListItem key={artist.id} artist={artist} onSelectArtist={this.setArtist} />
          <Divider component="li" />
        </React.Fragment>
      ));
      artistContent = <List>{artistElements}</List>;
    }
    return (
      <Container maxWidth="sm" className="app">
        <Box my={4}>
          <ArtistInput
            ref={this.artistInput}
            showInput={this.isArtistInputVisible()}
            onInputChange={this.fetchArtists} />
          {artistContent}
          <ActiveArtist
            artist={activeArtist}
            onDismiss={this.clearActiveArtist}
            onAdd={this.addActiveToList} />
          <Box my={2}>
            <AlbumInput
              albums={albums}
              showInput={this.isAlbumInputVisible()}
              onSelectAlbum={this.setAlbum} />
          </Box>
          { listContent }
        </Box>
      </Container>
    )
  }
}

export default App;
