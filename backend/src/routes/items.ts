import { Router } from 'express';
import { flatten } from 'mongo-dot-notation';
import Item from '../models/listitem.model';
import Artist from '../models/artist.model';
import Album from '../models/album.model';
import Image, { IImage } from '../models/image.model';

const router = Router();

// Get items
router.get('/', (req, res) => {
    let limit: number = 0;
    let offset: number = 0;
    if (typeof req.query.limit === 'string') {
        limit = parseInt(req.query.limit);
    }
    if (typeof req.query.offset === 'string') {
        offset = parseInt(req.query.offset);
    }
    Item.find()
        .sort({ createdAt: 'asc' })
        .skip(offset)
        .limit(limit)
        .then(items => res.json(items))
        .catch(err => res.status(400).json(err));
});

// Get item by ID
router.get('/item/:id', (req, res) => {
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

    artist.images = artist.images.map((image: IImage) => new Image(image));

    // Create concatenated ID from artist and album to check for uniqueness
    let id = artist.id;

    if (album) {
        album.images = album.images.map((image: IImage) => new Image(image));
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
    // TODO: Test this changed flatten.
    const values = flatten(req.body);
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

// Get all artist genres
router.get('/genres', (req, res) => {
    Item.distinct('artist.genres')
        .then(items => res.json(items))
        .catch(err => res.status(400).json(err));
});

export default router;
