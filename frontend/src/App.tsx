import React, { useState, useEffect } from 'react';
import axios from './utils/axios';
import Theme from './utils/theme';
import { ThemeProvider } from '@mui/material/styles';
import {
  alpha,
  Backdrop,
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  Divider,
  Fade,
  IconButton,
  List,
  Tab,
  useTheme,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Search from '@mui/icons-material/Search';
import Close from '@mui/icons-material/Close';
// import { FixedSizeList } from 'react-window';
// import { InfiniteLoader } from 'react-window-infinite-loader';
import TopBar from './components/TopBar';
import Login from './components/Login';
import GenreFilter from './components/GenreFilter';
import ArtistInput from './components/ArtistInput';
import ArtistResultListItem from './components/ArtistResultListItem';
import ActiveArtist from './components/ActiveArtist';
import AlbumInput from './components/AlbumInput';
import MusicList from './components/MusicList';
import Message from './components/Message';
import {
  TAlbum,
  TArtist,
  TGenre,
  TList,
  TListItem,
  TMessage,
} from './types/types';
import './utils/fonts';
import { AxiosError } from 'axios';

const apiBaseUrl = process.env.REACT_APP_API_URL;

const App = () => {
  const storedToken = localStorage.getItem('token');
  const [jwt, setJwt] = useState<string | null>(storedToken || null);
  const [searchBackdropOpen, setSearchBackdropOpen] = useState<boolean>(false);
  const [lists, setLists] = useState<TList[]>([]);
  const [genres, setGenres] = useState<TGenre[]>([]);
  const [activeGenres, setActiveGenres] = useState<TGenre[]>([]);
  const [activeArtist, setActiveArtist] = useState<TArtist>({} as TArtist);
  const [artistResults, setArtistResults] = useState<TArtist[]>([]);
  const [activeAlbum, setActiveAlbum] = useState<TAlbum>({} as TAlbum);
  const [albums, setAlbums] = useState<TAlbum[]>([]);
  const [artistQuery, setArtistQuery] = useState<string>('');
  const [relatedArtists, setRelatedArtists] = useState<TArtist[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingAlbums, setLoadingAlbums] = useState<boolean>(false);
  const [message, setMessage] = useState<TMessage | Record<string, never>>({});
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const theme = useTheme();

  useEffect(() => {
    if (jwt) {
      loadListItems();
      loadGenres();
    }
  }, [jwt]);

  useEffect(() => {
    fetchArtistAlbums();
    setArtistQuery('');
  }, [activeArtist]);

  useEffect(() => {
    setAlbums([]);
    addActiveToList(getDefaultListId());
  }, [activeAlbum]);

  useEffect(() => {
    fetchArtists();
  }, [artistQuery]);

  useEffect(() => {
    if (!activeTab && lists.length) {
      setActiveTab(lists[0]._id);
    }
  }, [lists]);

  useEffect(() => {
    if (!searchBackdropOpen) {
      setArtistResults([]);
      setActiveArtist({} as TArtist);
      setAlbums([]);
      setActiveAlbum({} as TAlbum);
    }
  }, [searchBackdropOpen]);

  const loadListItems = async () => {
    setLoading(true);
    const readListsUrl = `${apiBaseUrl}/lists`;
    const readItemsUrl = `${apiBaseUrl}/items`;
    Promise.all([axios.get(readListsUrl), axios.get(readItemsUrl)])
      .then(
        axios.spread((...responses) => {
          const allItems = responses[1].data;
          const lists = responses[0].data.map((list: TList) => {
            const items = allItems.filter(
              (item: TListItem) => item.list === list._id
            );
            return { ...list, items };
          });
          setLists(lists);
        })
      )
      .catch((error) => {
        handleError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadGenres = () => {
    axios
      .get(`${apiBaseUrl}/items/genres`)
      .then((response) => {
        setGenres(response.data);
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const getDefaultListId = () => {
    const defaultList = lists.find((list) => list.isDefault);
    return defaultList ? defaultList._id : null;
  };

  const deleteItem = (item: TListItem) => {
    const deleteItemUrl = `${apiBaseUrl}/items/delete/${item._id}`;
    setLoading(true);
    axios
      .delete(deleteItemUrl)
      .then(() => {
        loadListItems();
        loadGenres();
        setMessage({
          message: 'Item deleted successfully!',
          type: 'success',
        });
      })
      .catch((error) => {
        handleError(error);
        setLoading(false);
      });
  };

  const moveItemToList = (item: TListItem, listId: string) => {
    const updateItemUrl = `${apiBaseUrl}/items/update/${item._id}`;
    setLoading(true);
    axios
      .put(updateItemUrl, { list: listId })
      .then(() => {
        loadListItems();
        loadGenres();
        setMessage({
          message: 'Item updated successfully!',
          type: 'success',
        });
      })
      .catch((error) => {
        handleError(error);
        setLoading(false);
      });
  };

  const getRelatedArtists = (artistId: string | undefined) => {
    const relatedArtistsUrl = `${apiBaseUrl}/spotify/artist/${artistId}/related`;
    setLoading(true);
    axios
      .get(relatedArtistsUrl)
      .then((response) => {
        if (response.data.length === 0) {
          setMessage({
            message: 'No related artists found.',
            type: 'error',
          });
        } else {
          setRelatedArtists(response.data);
        }
      })
      .catch((error) => {
        handleError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const clearRelatedArtists = () => {
    setRelatedArtists([]);
  };

  const fetchArtists = () => {
    if (artistQuery.length === 0) {
      setArtistResults([]);
      return;
    }
    const artistSearchUrl = `${apiBaseUrl}/spotify/artist/${encodeURIComponent(
      artistQuery
    )}`;
    axios
      .get(artistSearchUrl)
      .then((response) => {
        setArtistResults(response.data);
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const fetchArtistAlbums = () => {
    if (Object.keys(activeArtist).length === 0) {
      // better way to do this?
      return;
    }
    setLoadingAlbums(true);
    const albumSearchUrl = `${apiBaseUrl}/spotify/artist/${activeArtist.id}/albums`;
    axios
      .get(albumSearchUrl)
      .then((response) => {
        setAlbums(response.data);
      })
      .catch((error) => {
        handleError(error);
      })
      .finally(() => {
        setLoadingAlbums(false);
      });
  };

  const setArtist = (artist: TArtist) => {
    setActiveArtist(artist);
  };

  const setAlbum = (album: TAlbum | null) => {
    if (!album) {
      setActiveAlbum({} as TAlbum);
    } else {
      setActiveAlbum(album);
    }
  };

  const constructItemFromState: () => TListItem = () => {
    const artist = {
      id: activeArtist.id,
      name: activeArtist.name,
      url: activeArtist.external_urls?.spotify,
      images: activeArtist.images,
      genres: activeArtist.genres,
    };

    let album = null;

    if (hasActiveAlbum) {
      album = {
        id: activeAlbum.id,
        name: activeAlbum.name,
        url: activeAlbum.external_urls?.spotify,
        images: activeAlbum.images,
        releaseDate: activeAlbum.release_date,
        tracks: activeAlbum.total_tracks,
      };
    }

    return {
      artist,
      album,
    };
  };

  const hasActiveAlbum = Object.keys(activeAlbum).length > 0;

  const hasActiveArtist = Object.keys(activeArtist).length > 0;

  const addActiveToList: (listId?: string | null) => void = (listId = null) => {
    if (!hasActiveArtist) {
      return;
    }
    const item = constructItemFromState();
    item.list = listId || getDefaultListId();
    setLoading(true);
    const createItemUrl = `${apiBaseUrl}/items/create`;
    axios
      .post(createItemUrl, item)
      .then(() => {
        // setActiveArtist({});
        // setActiveAlbum({});
        loadListItems();
        loadGenres();
        setSearchBackdropOpen(false);
        setMessage({
          message: 'Item added successfully!',
          type: 'error',
        });
      })
      .catch((error) => {
        handleError(error);
      })
      .finally(() => setLoading(false));
  };

  const onSetGenres = (genres: TGenre[]) => {
    setActiveGenres(genres);
  };

  const handleError = (error: AxiosError<Record<string, never>>) => {
    let messages: string | string[] = '';
    if (error.response) {
      console.log(error.response);
      if (error.response.status === 401) {
        // Unauthorized, which means our token has expired.
        setJwt(null);
        localStorage.removeItem('token');
        return;
      }
      if (error.response.data?.name === 'ValidationError') {
        console.log(error.response.data);
        messages = Object.values<Record<string, never>>(
          error.response.data.errors
        )
          .map((msg) => {
            if (msg?.message) {
              return msg?.message;
            }
            return '';
          })
          .filter(Boolean);
      } else {
        messages = error.response.statusText;
      }
    } else {
      // Other error, show generic error message
      messages = error.message;
    }

    console.log('setting message', messages);

    setMessage({
      message: messages,
      type: 'error',
    });
  };

  const clearMessage = () => {
    setMessage({});
  };

  const isArtistInputVisible = !hasActiveArtist;

  const isAlbumInputVisible = hasActiveArtist && !loadingAlbums;

  const getListContent = () => {
    if (!activeTab) {
      return null;
    }

    const tabPanels = lists.map((list) => {
      console.log(list);
      const listActions = lists.filter((l) => l._id !== list._id);
      return (
        <TabPanel
          key={list._id}
          value={list._id}
          sx={{ padding: theme.spacing(3, 0) }}
        >
          <MusicList
            key={list._id}
            list={list}
            listActions={listActions}
            activeGenres={activeGenres}
            relatedArtists={relatedArtists}
            onMoveItem={moveItemToList}
            onDeleteItem={deleteItem}
            onGetRelated={getRelatedArtists}
            onClearRelated={clearRelatedArtists}
          />
        </TabPanel>
      );
    });

    const tabs = lists.map((list) => {
      return <Tab key={list._id} label={list.title} value={list._id} />;
    });
    return (
      <TabContext value={activeTab}>
        <TabList
          variant="fullWidth"
          onChange={(e, newValue) => setActiveTab(newValue)}
          textColor="primary"
          indicatorColor="primary"
        >
          {tabs}
        </TabList>
        {tabPanels}
      </TabContext>
    );
  };

  const getArtistContent = () => {
    const elements = artistResults.map((artist) => (
      <React.Fragment key={artist.id}>
        <ArtistResultListItem
          key={artist.id}
          artist={artist}
          showGenres={true}
          onSelectArtist={setArtist}
        />
        <Divider component="li" />
      </React.Fragment>
    ));
    return <List>{elements}</List>;
  };

  let mainContent;

  if (jwt === null) {
    mainContent = (
      <Login
        setToken={setJwt}
        setMessage={setMessage}
        loginRoute={`${apiBaseUrl}/auth/signin`}
      />
    );
  } else {
    mainContent = (
      <Container maxWidth="md" className="app">
        <Backdrop
          sx={{
            zIndex: theme.zIndex.drawer + 2,
            color: theme.palette.common.white,
            backgroundColor: alpha(theme.palette.common.black, 0.4),
          }}
          open={loading}
        >
          <CircularProgress color="inherit" disableShrink />
        </Backdrop>
        <Fade in={true} timeout={1000}>
          <Box my={4}>
            <Box my={6} display="flex" justifyContent="center">
              <IconButton
                aria-label="Open search"
                color="primary"
                onClick={() => setSearchBackdropOpen(true)}
                size="large"
              >
                <Search fontSize="large" />
              </IconButton>
            </Box>
            <Backdrop
              open={searchBackdropOpen}
              sx={{
                backgroundColor: theme.palette.common.black,
                zIndex: theme.zIndex.drawer + 1,
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                overflowY: 'auto',
              }}
            >
              {searchBackdropOpen && (
                <>
                  <IconButton
                    aria-label="Close search"
                    onClick={() => setSearchBackdropOpen(false)}
                    sx={{
                      position: 'absolute',
                      top: theme.spacing(1),
                      right: theme.spacing(1),
                    }}
                    size="large"
                  >
                    <Close fontSize="large" />
                  </IconButton>
                  <Container
                    maxWidth="sm"
                    sx={{ height: '100%', textAlign: 'center' }}
                  >
                    <Box mt={8}>
                      <ArtistInput
                        artistQuery={artistQuery}
                        showInput={isArtistInputVisible}
                        onInputChange={(text) => setArtistQuery(text)}
                      />
                      <Box mt={4}>{getArtistContent()}</Box>
                      <ActiveArtist
                        artist={activeArtist}
                        onDismiss={() => setActiveArtist({} as TArtist)}
                        onAdd={addActiveToList}
                      />
                      <Box my={2}>
                        <AlbumInput
                          albums={albums}
                          showInput={isAlbumInputVisible}
                          onSelectAlbum={setAlbum}
                        />
                      </Box>
                    </Box>
                  </Container>
                </>
              )}
            </Backdrop>
            {getListContent()}
          </Box>
        </Fade>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline>
        <TopBar appTitle="Musiqueue">
          <GenreFilter
            genres={genres}
            activeGenres={activeGenres}
            genreSetter={onSetGenres}
          />
        </TopBar>
        {mainContent}
        <Message message={message} onClear={clearMessage}></Message>
      </CssBaseline>
    </ThemeProvider>
  );
};

export default App;
