import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { expressjwt } from 'express-jwt';
import dotenv from 'dotenv';

// Routes
import authRouter from './routes/auth';
import listsRouter from './routes/lists';
import itemsRouter from './routes/items';
import spotifyRouter from './routes/spotify';
import { Secret } from 'jsonwebtoken';

dotenv.config();

const app = express();
const port: number|string = process.env.PORT || 5000;

const publicPaths: string[] = [
    '/auth/signup',
    '/auth/signin',
];
const secret: Secret = process.env.TOKEN_SECRET || '';
app.use(cors());
app.use(express.json());
app.use(
    expressjwt({
        secret,
        algorithms: ['HS256'],
    })
    .unless({ path: publicPaths }));

const uri: string = process.env.ATLAS_URI || '';

mongoose.set('strictQuery', false);
mongoose.connect(uri);

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
