/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');

// Firestore initialization
const serviceAccount = require("./permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://music-app-a2bd9.firebaseio.com"
});

// Database initialization
const db = admin.firestore();

// Spotify initialization
const spotifyApi = new SpotifyWebApi({
	clientId: 'e68986cf68cb4a33896b9735e77ce971',
	clientSecret: 'fa8d875f626f483490030cf940041fa9',
});

const getSpotifyAccessToken = async () => {
	const data = await spotifyApi.clientCredentialsGrant();
	spotifyApi.setAccessToken(data.body.access_token);
	return spotifyApi;
}

// App initialization
const app = express();

app.use(cors({origin: true}));

app.get('/spotify/search-artist/:q', (req, res) => {
	(async () => {
		const searchParams = { limit: 10 };
		try {
			await getSpotifyAccessToken();
			const response = await spotifyApi
				.searchArtists(
					req.params.q,
					searchParams
				)
				.then(data => {
					if (data.statusCode !== 200) {
						return res.status(data.statusCode).send(data.body.message);
					}
					return data.body.artists.items;
				});
			return res.status(200).send(response);
		} catch (error) {
			console.log(error);
			return res.status(500).send(error);
		}
	})();
});

app.get('/spotify/get-artist-albums/:artist_id', (req, res) => {
	(async () => {
		const searchParams = {album_type: 'album'};
		try {
			await getSpotifyAccessToken();
			const response = await spotifyApi
				.getArtistAlbums(
					req.params.artist_id,
					searchParams
				)
				.then(data => {
					if (data.statusCode !== 200) {
						return res.status(data.statusCode).send(data.body.message);
					}
					return data.body.items;
				});
			return res.status(200).send(response);
		} catch(error) {
			console.log(error);
			return res.status(500).send(error);
		}
	})();
});

// Create
app.post('/api/create-item', (req, res) => {
	(async () => {
		try {
			const item = req.body;
			let itemId = item.artistId;
			if (item.albumId) {
				itemId += item.albumId;
			}
			item.createdAt = admin.firestore.Timestamp.fromDate(new Date());
			await db
				.collection('items')
				.doc(itemId)
				.create(item);
			return res.status(200).send(itemId);
		} catch(error) {
			console.log(error);
			return res.status(500).send(error);
		}
	})();
});

// Read
app.get('/api/read-items', (req, res) => {
	(async () => {
		try {
			const query = db.collection('items');
			const response = [];
			await query.get().then(snapshot => {
				const docs = snapshot.docs;
				docs.forEach(doc => {
					response.push({
						id: doc.id,
						item: doc.data().item,
					});
				});
			});
			return res.status(200).send(response);
		} catch (error) {
			console.log(error);
			return res.status(500).send(error);
		}
	})();
});

// Read by list ID
app.get('/api/read-items/:list_id', (req, res) => {
	(async () => {
        try {
            const query = db
                .collection('items')
				.where('listId', '==', parseInt(req.params.list_id))
				.orderBy('createdAt');
            const response = [];
            await query.get().then(snapshot => {
                snapshot.forEach(doc => {
                    response.push(doc.data());
                });
            });
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
	})();
});

// Read single item
app.get('/api/read-item/:item_id', (req, res) => {
	(async () => {
		try {
			const query = db.collection('items').doc(req.params.item_id);
			let response = null;
			await query.get().then(doc => {
				if (doc.exists) {
					response = doc.data();
				}
			});
			return response ? res.status(200).send(response) : res.status(404).send();
		} catch (error) {
			console.log(error);
			return res.status(500).send(error);
		}
	})();
});

// Update
app.put('/api/update-item/:item_id', (req, res) => {
	(async () => {
		try {
			const document = db
				.collection('items')
				.doc(req.params.item_id);
			await document.update({
				item: req.body.item
			});
			return res.status(200).send();
		} catch (error) {
			console.log(error);
			return res.status(500).send(error);
		}
	})();
});

// Delete
app.delete('/api/delete-item/:item_id', (req, res) => {
	(async () => {
		try {
			const document = db
				.collection('items')
				.doc(req.params.item_id);
			await document.delete();
			return res.status(200).send();
		} catch (error) {
			console.log(error);
			return res.status(500).send(error);
		}
	})();
});

exports.app = functions.https.onRequest(app);
