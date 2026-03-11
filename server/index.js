import express from 'express';
import mongoose from "mongoose"
import cookieParser from 'cookie-parser';
import cors from "cors";

import routes from "./routes.js";
import config from './config/config.js';
import { errorHandler } from './middlewares/errorHandler.js';

const PORT = 3000

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://finora-web.netlify.app"
        ],
        credentials: true
    })
);

app.use(routes);

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


app.use(errorHandler())