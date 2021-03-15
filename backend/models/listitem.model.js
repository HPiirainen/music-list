const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const Artist = require('./artist.model').schema;
const Album = require('./album.model').schema;

const listItemSchema = new Schema(
    // Schema keys
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        list: {
            type: Schema.Types.ObjectId,
            ref: 'List',
            required: true,
        },
        artist: {
            type: Artist,
            required: true,
        },
        album: Album,
    },
    // Options
    {
        timestamps: true,
    },
);

listItemSchema.plugin(uniqueValidator, {
    message: 'This artist and / or album already exists!',
});

const ListItem = mongoose.model('ListItem', listItemSchema);

module.exports = ListItem;
