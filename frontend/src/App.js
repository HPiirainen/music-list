import React, { Component } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import {
  Container,
  Box,
  List,
  Divider,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import ArtistInput from './components/ArtistInput';
import ArtistResultListItem from './components/ArtistResultListItem';
import ActiveArtist from './components/ActiveArtist';
import AlbumInput from './components/AlbumInput';
import MusicList from './components/MusicList';
import './App.css';

const styles = theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [],
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
    this.setState({ loading: true });
    const readAllListsUrl = `${this.getApiBaseUrl()}/api/read-lists`;
    const readAllItemsUrl = `${this.getApiBaseUrl()}/api/read-items`;
    Promise.all([axios.get(readAllListsUrl), axios.get(readAllItemsUrl)])
      .then(axios.spread((...responses) => {
        const items = responses[1].data;
        const lists = responses[0].data.map(list => {
          const listItems = items.filter(item => item.listId === list.id);
          return { ...list, items: listItems };
        });
        this.setState({
          lists,
          loading: false
        });
      }))
      .catch(error => {
        console.log(error);
        this.setState({ loading: false });
      });
  }

  getDefaultListId = () => {
    const { lists } = this.state;
    const defaultList = lists.find(list => list.isDefault);
    return defaultList ? defaultList.id : null;
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
      this.addActiveToList(this.getDefaultListId());
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

  addActiveToList = (listId = null) => {
    if (!this.hasActiveArtist()) {
      return;
    }
    const item = this.constructItemFromState();
    item.listId = listId || this.getDefaultListId();
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
    const { classes } = this.props;
    const listContent = lists.map(list => {
      const listActions = lists.filter(l => l.id !== list.id);
      return (<MusicList key={list.id} list={list} listActions={listActions} onMoveItem={this.moveItemToList} onDeleteItem={this.deleteItem} />)
    });
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
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" disableShrink />
        </Backdrop>
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

export default withStyles(styles)(App);
