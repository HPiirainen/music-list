const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const expressJwt = require('express-jwt');

require('dotenv').config();

// Routes
const authRouter = require('./routes/auth');
const listsRouter = require('./routes/lists');
const itemsRouter = require('./routes/items');
const spotifyRouter = require('./routes/spotify');

const app = express();
const port = process.env.PORT || 5000;

const publicPaths = [
    '/auth/signup',
    '/auth/signin',
];

app.use(cors());
app.use(express.json());
app.use(
    expressJwt({
        secret: process.env.TOKEN_SECRET,
        algorithms: ['HS256'],
    })
    .unless({ path: publicPaths }));

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
    console.log('MongoDB db connection established');
});

app.use('/auth', authRouter);
app.use('/lists', listsRouter);
app.use('/items', itemsRouter);
app.use('/spotify', spotifyRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));
