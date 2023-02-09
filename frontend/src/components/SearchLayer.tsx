import React, { useEffect, useReducer } from 'react';
import axios from '../utils/axios';
import { TAlbum, TArtist, TListItem } from '../types/types';
import {
  Box,
  CircularProgress,
  Container,
  Divider,
  List,
  useTheme,
} from '@mui/material';
import ArtistInput from './ArtistInput';
import ActiveArtist from './ActiveArtist';
import AlbumInput from './AlbumInput';
import ArtistResultListItem from './ArtistResultListItem';

enum SearchStateActionType {
  SET_ARTISTS,
  SET_ARTIST,
  SET_ALBUMS,
  SET_ALBUM,
  SET_STATUS,
}

enum SearchStateStatus {
  IDLE,
  LOADING,
  READY,
}

interface SearchLayerProps {
  dispatchItem: (item: TListItem) => void;
}

interface SearchState {
  status?: SearchStateStatus;
  artists?: TArtist[];
  artist?: TArtist;
  album?: TAlbum;
  albums?: TAlbum[];
}

interface SearchStateAction {
  type: SearchStateActionType;
  payload: Partial<SearchState>;
}

const searchStateReducer = (state: SearchState, action: SearchStateAction) => {
  const { type, payload } = action;
  console.log('searchReducer', type, payload);
  switch (type) {
    case SearchStateActionType.SET_ARTISTS:
    case SearchStateActionType.SET_ARTIST:
    case SearchStateActionType.SET_ALBUM:
    case SearchStateActionType.SET_ALBUMS:
    case SearchStateActionType.SET_STATUS:
      return {
        ...state,
        ...payload,
      };
    default:
      throw new Error('Unknown searchStateReducer action type: ' + action.type);
  }
};

const apiBaseUrl = process.env.REACT_APP_API_URL;

const SearchLayer: React.FC<SearchLayerProps> = ({ dispatchItem }) => {
  const [searchState, dispatchSearchState] = useReducer(searchStateReducer, {});

  useEffect(() => {
    if (typeof searchState.artist === 'undefined') {
      return;
    }
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchAlbums = async () => {
      dispatchSearchState({
        type: SearchStateActionType.SET_STATUS,
        payload: { status: SearchStateStatus.LOADING },
      });
      const options = { signal };
      try {
        const albumSearchUrl = `${apiBaseUrl}/spotify/artist/${searchState?.artist?.id}/albums`;
        const response = await axios.get(albumSearchUrl, options);
        dispatchSearchState({
          type: SearchStateActionType.SET_ALBUMS,
          payload: { albums: response.data, status: SearchStateStatus.READY },
        });
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error);
        } else if (error instanceof Error) {
          console.error(error);
          // handleError(error);
        }
      }
    };

    fetchAlbums();

    return () => controller.abort();
  }, [searchState.artist]);

  const theme = useTheme();

  const onAdd = () => {
    const item = constructItemFromState();
    if (item) {
      console.log('dispatchItem', item);
      dispatchItem(item);
    }
  };

  const fetchArtists = async (text: string) => {
    if (text.length === 0) {
      dispatchSearchState({
        type: SearchStateActionType.SET_ARTISTS,
        payload: { artists: [] },
      });
      return;
    }
    dispatchSearchState({
      type: SearchStateActionType.SET_STATUS,
      payload: { status: SearchStateStatus.LOADING },
    });
    const artistSearchUrl = `${apiBaseUrl}/spotify/artist/${encodeURIComponent(
      text
    )}`;
    try {
      // TODO: use AbortController
      const response = await axios.get(artistSearchUrl);
      dispatchSearchState({
        type: SearchStateActionType.SET_ARTISTS,
        payload: {
          artists: response.data,
          album: undefined,
          artist: undefined,
          status: SearchStateStatus.READY,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        // TODO: ErrorBoundary?
        // handleError(error);
      }
    }
  };

  const constructItemFromState: () => TListItem | null = () => {
    if (typeof searchState.artist === 'undefined') {
      return null;
    }
    const artist = {
      id: searchState.artist.id,
      name: searchState.artist.name,
      url: searchState.artist.external_urls?.spotify,
      images: searchState.artist.images,
      genres: searchState.artist.genres,
    };
    let album = null;
    if (typeof searchState.album !== 'undefined') {
      album = {
        id: searchState.album.id,
        name: searchState.album.name,
        url: searchState.album.external_urls?.spotify,
        images: searchState.album.images,
        releaseDate: searchState.album.release_date,
        tracks: searchState.album.total_tracks,
      };
    }
    return {
      artist,
      album,
    };
  };

  const artistList = searchState.artists?.map((artist: TArtist) => (
    <React.Fragment key={artist.id}>
      <ArtistResultListItem
        key={artist.id}
        artist={artist}
        showGenres={true}
        onSelectArtist={(artist) =>
          dispatchSearchState({
            type: SearchStateActionType.SET_ARTIST,
            payload: { artist, artists: [] },
          })
        }
      />
      <Divider component="li" />
    </React.Fragment>
  ));

  let albumInput = null;

  // TODO: Make this better, use one progress indicator
  if (searchState.status === SearchStateStatus.READY) {
    if (searchState.albums?.length) {
      albumInput = (
        <Box my={2}>
          <AlbumInput
            albums={searchState.albums}
            showInput={true}
            onSelectAlbum={(album) => {
              if (album) {
                dispatchSearchState({
                  type: SearchStateActionType.SET_ALBUM,
                  payload: { album },
                });
              }
            }}
          />
        </Box>
      );
    }
  } else if (searchState.status === SearchStateStatus.LOADING) {
    albumInput = (
      <CircularProgress
        sx={{ marginTop: theme.spacing(4) }}
        color="inherit"
        disableShrink
      />
    );
  }

  return (
    <Container maxWidth="sm" sx={{ height: '100%', textAlign: 'center' }}>
      <Box mt={8}>
        <ArtistInput
          showInput={!searchState.artist}
          onInputChange={fetchArtists}
        />
        <Box mt={4}>
          <List>{artistList}</List>
        </Box>
        <ActiveArtist
          artist={searchState.artist}
          onDismiss={() =>
            dispatchSearchState({
              type: SearchStateActionType.SET_ARTIST,
              payload: {
                artist: undefined,
                album: undefined,
                albums: [] as TAlbum[],
              },
            })
          }
          onAdd={onAdd}
        />
        {albumInput}
      </Box>
    </Container>
  );
};

export default SearchLayer;
