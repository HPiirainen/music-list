const router = require('express').Router();
const dotify = require('node-dotify');
const Item = require('../models/listitem.model');
const Artist = require('../models/artist.model');
const Album = require('../models/album.model');
const Image = require('../models/image.model');

// Get items
router.get('/', (req, res) => {
    Item.find()
        .sort({ createdAt: 'asc' })
        .then(items => res.json(items))
        .catch(err => res.status(400).json(err));
});

// Get item by ID
router.get('/:id', (req, res) => {
    Item.findById(req.params.id)
        .then(item => res.json(item))
        .catch(err => res.status(400).json(err));
});

// Get items from list
router.get('/list/:id', (req, res) => {
    Item.find({ list: req.params.id })
        .sort({ createdAt: 'asc' })
        .then(items => res.json(items))
        .catch(err => res.status(400).json(err));
});

// Create item
router.post('/create', (req, res) => {
    const {
        list,
        artist,
        album,
    } = req.body;

    artist.images = artist.images.map(image => new Image(image));

    // Create concatenated ID from artist and album to check for uniqueness
    let id = artist.id;

    if (album) {
        album.images = album.images.map(image => new Image(image));
        id += album.id;
    }

    const item = new Item({
        id,
        list,
        artist: new Artist(artist),
        album: album ? new Album(album) : null,
    });

    item.save()
        .then(() => res.status(200).send('Item created.'))
        .catch(err => res.status(400).json(err));
});

// Update item
router.put('/update/:id', (req, res) => {
    const values = dotify(req.body);
    Item.updateOne({ _id: req.params.id }, values )
        .then(() => res.status(200).send('Item updated.'))
        .catch(err => res.status(400).json(err));
});

// Delete item
router.delete('/delete/:id', (req, res) => {
    Item.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).send('Item deleted.'))
        .catch(err => res.status(400).json(err));
});

module.exports = router;
