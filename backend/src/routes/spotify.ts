import { Router } from 'express';
import spotifyApi from '../spotify-api';

const router = Router();

// Middleware for all routes
router.use(async (req, res, next) => {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
    next();
});

// Search artists and albums
router.get('/search/:q', async (req, res) => {
    const searchParams = {
        market: 'FI',
        limit: 10,
    };
    try {
        const response = await spotifyApi
            .search(
                req.params.q,
                ['artist', 'album'],
                searchParams
            )
            .then(data => {
                if (data.statusCode !== 200) {
                    return res.status(data.statusCode).json(data.body);
                }
                return data.body;
            });
        return res.status(200).send(response);
    } catch (err) {
        return res.status(400).json(err)
    }
});

// Search artists
router.get('/artist/:q', async (req, res) => {
    const searchParams = { limit: 20 };
    try {
        const response = await spotifyApi
            .searchArtists(
                req.params.q,
                searchParams,
            )
            .then(data => {
                if (data.statusCode !== 200) {
                    return res.status(data.statusCode).json(data.body);
                }
                return data.body.artists?.items;
            });
        return res.status(200).send(response);
    } catch (err) {
        return res.status(400).json(err)
    }
});

// Get artist albums
router.get('/artist/:id/albums', async (req, res) => {
    const searchParams = {
        include_groups: 'album',
        market: 'FI',
        limit: 50,
    };
    try {
        const response = await spotifyApi
            .getArtistAlbums(
                req.params.id,
                searchParams,
            )
            .then(data => {
                if ( data.statusCode !== 200) {
                    return res.status(data.statusCode).json(data.body);
                }
                return data.body.items;
            });
        return res.status(200).send(response);
    } catch (err) {
        return res.status(400).json(err);
    }
});

// Get related artists
router.get('/artist/:id/related', async (req, res) => {
    try {
        const max = 10;
        const response = await spotifyApi
            .getArtistRelatedArtists(
                req.params.id
            )
            .then(data => {
                if (data.statusCode !== 200) {
                    return res.status(data.statusCode).json(data.body);
                }
                return data.body.artists.slice(0, max);
            });
        return res.status(200).send(response);
    } catch (err) {
        return res.status(400).json(err);
    }
});

export default router;
