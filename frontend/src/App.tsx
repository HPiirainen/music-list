import React, { useState, useEffect, useReducer } from 'react';
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
import { AxiosError, AxiosResponse } from 'axios';
import { useAuth } from './hooks/useAuth';

enum AppStateActionType {
  SET_STATUS = 'set_status',
}

enum AppStateStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  ERROR = 'error',
  READY = 'ready',
}

interface AppState {
  status: AppStateStatus;
}

interface AppStateAction {
  type: AppStateActionType;
  payload: AppStateStatus;
}

interface ErrorData {
  name: string;
  errors: Record<string, never>;
}

const apiBaseUrl = process.env.REACT_APP_API_URL;

function createInitialAppState(): AppState {
  return {
    status: AppStateStatus.IDLE,
  };
}

const appStateReducer = (state: AppState, action: AppStateAction) => {
  const { type, payload } = action;
  console.log('reducer', type, payload);
  if (type === AppStateActionType.SET_STATUS) {
    return {
      ...state,
      status: payload,
    };
  }
  throw new Error('Unknown appStateReducer action type: ' + action.type);
};

const App: React.FC = () => {
  // Handles loading status etc.
  const [appState, dispatchAppState] = useReducer(
    appStateReducer,
    null,
    createInitialAppState
  );
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
  const [loadingAlbums, setLoadingAlbums] = useState<boolean>(false);
  const [message, setMessage] = useState<TMessage | Record<string, never>>({});
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const { user, logout } = useAuth();
  const theme = useTheme();

  const appIsIdle = appState.status === AppStateStatus.IDLE;
  const appIsLoading = appState.status === AppStateStatus.LOADING;
  const appIsReady = appState.status === AppStateStatus.READY;
  const appIsError = appState.status === AppStateStatus.ERROR;

  useEffect(() => {
    console.log('useEffect: initial');
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchData = async () => {
      dispatchAppState({
        type: AppStateActionType.SET_STATUS,
        payload: AppStateStatus.LOADING,
      });
      const options = { signal };
      try {
        await Promise.all<AxiosResponse>([
          axios.get(`${apiBaseUrl}/items/genres`, options),
          axios.get(`${apiBaseUrl}/lists`, options),
          axios.get(`${apiBaseUrl}/items`, options),
        ]).then(([{ data: genres }, { data: lists }, { data: items }]) => {
          const newLists = lists.map((list: TList) => {
            const listItems = items.filter(
              (item: TListItem) => item.list === list._id
            );
            return { ...list, items: listItems };
          });
          setLists(newLists);
          setGenres(genres);
          dispatchAppState({
            type: AppStateActionType.SET_STATUS,
            payload: AppStateStatus.READY,
          });
        });
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error);
        } else if (error instanceof Error) {
          handleError(error);
        }
      }
    };

    fetchData();

    return () => controller.abort();
  }, []);

  // useEffect(() => {
  //   console.log('useEffect: jwt');
  //   if (jwt) {
  //     loadListItems();
  //     loadGenres();
  //   }
  // }, [jwt]);

  // useEffect(() => {
  //   console.log('useEffect: activeArtist');
  //   fetchArtistAlbums();
  //   setArtistQuery('');
  // }, [activeArtist]);

  // useEffect(() => {
  //   console.log('useEffect: activeAlbum');
  //   setAlbums([]);
  //   addActiveToList(getDefaultListId());
  // }, [activeAlbum]);

  // useEffect(() => {
  //   console.log('useEffect: artistQuery');
  //   fetchArtists();
  // }, [artistQuery]);

  // useEffect(() => {
  //   console.log('useEffect: lists');
  //   if (!activeTab && lists.length) {
  //     setActiveTab(lists[0]._id);
  //   }
  // }, [lists]);

  // useEffect(() => {
  //   console.log('useEffect: searchBackDropOpen');
  //   if (!searchBackdropOpen) {
  //     setArtistResults([]);
  //     setActiveArtist({} as TArtist);
  //     setAlbums([]);
  //     setActiveAlbum({} as TAlbum);
  //   }
  // }, [searchBackdropOpen]);

  const loadGenres = () => {
    dispatchAppState({
      type: AppStateActionType.SET_STATUS,
      payload: AppStateStatus.LOADING,
    });
    axios
      .get(`${apiBaseUrl}/items/genres`)
      .then((response) => {
        setGenres(response.data);
        dispatchAppState({
          type: AppStateActionType.SET_STATUS,
          payload: AppStateStatus.READY,
        });
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const loadListItems = async () => {
    dispatchAppState({
      type: AppStateActionType.SET_STATUS,
      payload: AppStateStatus.LOADING,
    });
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
          dispatchAppState({
            type: AppStateActionType.SET_STATUS,
            payload: AppStateStatus.READY,
          });
        })
      )
      .catch((error) => {
        handleError(error);
        dispatchAppState({
          type: AppStateActionType.SET_STATUS,
          payload: AppStateStatus.ERROR,
        });
      });
  };

  const getDefaultListId = () => {
    const defaultList = lists.find((list) => list.isDefault);
    return defaultList ? defaultList._id : null;
  };

  const deleteItem = (item: TListItem) => {
    const deleteItemUrl = `${apiBaseUrl}/items/delete/${item._id}`;
    dispatchAppState({
      type: AppStateActionType.SET_STATUS,
      payload: AppStateStatus.LOADING,
    });
    axios
      .delete(deleteItemUrl)
      .then(() => {
        loadListItems();
        loadGenres();
        setMessage({
          message: 'Item deleted successfully!',
          type: 'success',
        });
        dispatchAppState({
          type: AppStateActionType.SET_STATUS,
          payload: AppStateStatus.READY,
        });
      })
      .catch((error) => {
        handleError(error);
        dispatchAppState({
          type: AppStateActionType.SET_STATUS,
          payload: AppStateStatus.ERROR,
        });
      });
  };

  const moveItemToList = (item: TListItem, listId: string) => {
    const updateItemUrl = `${apiBaseUrl}/items/update/${item._id}`;
    dispatchAppState({
      type: AppStateActionType.SET_STATUS,
      payload: AppStateStatus.LOADING,
    });
    axios
      .put(updateItemUrl, { list: listId })
      .then(() => {
        loadListItems();
        loadGenres();
        setMessage({
          message: 'Item updated successfully!',
          type: 'success',
        });
        dispatchAppState({
          type: AppStateActionType.SET_STATUS,
          payload: AppStateStatus.READY,
        });
      })
      .catch((error) => {
        handleError(error);
        dispatchAppState({
          type: AppStateActionType.SET_STATUS,
          payload: AppStateStatus.ERROR,
        });
      });
  };

  const getRelatedArtists = (artistId: string | undefined) => {
    const relatedArtistsUrl = `${apiBaseUrl}/spotify/artist/${artistId}/related`;
    dispatchAppState({
      type: AppStateActionType.SET_STATUS,
      payload: AppStateStatus.LOADING,
    });
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
        dispatchAppState({
          type: AppStateActionType.SET_STATUS,
          payload: AppStateStatus.READY,
        });
      })
      .catch((error) => {
        handleError(error);
        dispatchAppState({
          type: AppStateActionType.SET_STATUS,
          payload: AppStateStatus.ERROR,
        });
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
    dispatchAppState({
      type: AppStateActionType.SET_STATUS,
      payload: AppStateStatus.LOADING,
    });
    const albumSearchUrl = `${apiBaseUrl}/spotify/artist/${activeArtist.id}/albums`;
    axios
      .get(albumSearchUrl)
      .then((response) => {
        setAlbums(response.data);
        dispatchAppState({
          type: AppStateActionType.SET_STATUS,
          payload: AppStateStatus.READY,
        });
      })
      .catch((error) => {
        handleError(error);
        dispatchAppState({
          type: AppStateActionType.SET_STATUS,
          payload: AppStateStatus.ERROR,
        });
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
    dispatchAppState({
      type: AppStateActionType.SET_STATUS,
      payload: AppStateStatus.LOADING,
    });
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
          type: 'success',
        });
        dispatchAppState({
          type: AppStateActionType.SET_STATUS,
          payload: AppStateStatus.READY,
        });
      })
      .catch((error) => {
        handleError(error);
        dispatchAppState({
          type: AppStateActionType.SET_STATUS,
          payload: AppStateStatus.ERROR,
        });
      });
  };

  const onSetGenres = (genres: TGenre[]) => {
    setActiveGenres(genres);
  };

  const handleError = (error: Error) => {
    let messages: string | string[] = '';
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) {
      // Unauthorized, which means our token has expired.
      // setJwt(null);
      // localStorage.removeItem('token');
      // logout();
      return;
    }

    const data = axiosError.response?.data as ErrorData;
    if (data?.name === 'ValidationError') {
      messages = Object.values<Record<string, never>>(data?.errors).map(
        (msg) => msg?.message || 'Unknown error'
      );
    } else {
      messages = axiosError.response?.statusText || error.message;
    }

    setMessage({
      message: messages,
      type: 'error',
    });

    dispatchAppState({
      type: AppStateActionType.SET_STATUS,
      payload: AppStateStatus.ERROR,
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

  const mainContent = (
    <Container maxWidth="md" className="app">
      <Backdrop
        sx={{
          zIndex: theme.zIndex.drawer + 2,
          color: theme.palette.common.white,
          backgroundColor: alpha(theme.palette.common.black, 0.4),
        }}
        open={appIsLoading}
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
  // }

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
        {appState.status}
        {mainContent}
        <Message message={message} onClear={clearMessage}></Message>
      </CssBaseline>
    </ThemeProvider>
  );
};

export default App;
