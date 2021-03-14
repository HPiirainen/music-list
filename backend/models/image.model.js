const mongoose = require('mongoose');

const { Schema } = mongoose;

const imageSchema = new Schema(
    // Schema keys
    {
        url: {
            type: String,
            required: true,
        },
        width: Number,
        height: Number,
    },
);

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
module.exports.schema = imageSchema;
