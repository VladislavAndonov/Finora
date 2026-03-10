import express from 'express';
import mongoose from "mongoose"
import cookieParser from 'cookie-parser';
<<<<<<< HEAD
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
=======
import cors from "cors";

import routes from "./routes.js";
import config from './config/config.js';

const PORT = 3000
>>>>>>> ui-improvements

const app = express();

app.use(express.json());
app.use(cookieParser());

<<<<<<< HEAD

app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN || true,
=======
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://finora-web.netlify.app"
        ],
>>>>>>> ui-improvements
        credentials: true
    })
);

app.use(routes);

<<<<<<< HEAD
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
=======
mongoose.connect(config.dbURL, { dbName: "finora_dev" }) // Change DB in production
    .then(() => {
        console.log("Connected to DB");
    })
    .catch(err => {
        console.error('Mongo connection error:', err.message);
        process.exit(1);
    });

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})
>>>>>>> ui-improvements
