import express from 'express';
import routes from "./routes.js";
import cors from "cors";
import mongoose from "mongoose"
import config from './config/config.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cookieParser());


app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN || true,
        credentials: true
    })
);

app.use(routes);

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

mongoose.connect(process.env.DB_CONNECTION_STRING)
    .then(() => console.log('Mongo connected'))
    .catch(err => {
        console.error('Mongo connection error:', err.message);
    });

app.get('/health', (_, res) => res.send('ok'));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on ${PORT}`);
});