import express from 'express';
import routes from "./routes.js";
import cors from "cors";
import mongoose from "mongoose"
import config from './config/config.js';
import cookieParser from 'cookie-parser';


try {
    await mongoose.connect(config.dbURL, { dbName: "finora" });
    console.log("Connected to DB");
} catch (err) {
    console.log("Cannot connect to DB");
}

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5000",
    credentials: true
}));
app.use(cookieParser())
app.use(routes);

app.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port}`);
});
