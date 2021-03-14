const mongoose = require('mongoose');

const { Schema } = mongoose;

const Image = require('./image.model').schema;

const albumSchema = new Schema(
    // Schema keys
    {
        id: {
            type: String,
            required: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            trim: true,
        },
        images: [Image],
        releaseDate: Date,
        tracks: Number,
    },
);

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
module.exports.schema = albumSchema;
