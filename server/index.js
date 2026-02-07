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

try {
    await mongoose.connect(config.dbURL, { dbName: "finora" });
    console.log("Connected to DB");
} catch (err) {
    console.log("Cannot connect to DB", err);
    process.exit(1)
}


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

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});