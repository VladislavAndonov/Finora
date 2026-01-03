import express, { urlencoded } from 'express';
import routes from "./routes.js";
import cors from "cors";
import mongoose from "mongoose"
import config from './config/config.js';


try {
    await mongoose.connect(config.dbURL, { dbName: "finora" });
    console.log("Connected to DB");
} catch (err) {
    console.log("Cannot connect to DB");
}

const app = express();
const port = 3000;

app.use(urlencoded({ extended: false }));
app.use(cors());
app.use(routes);

app.listen(port, () => {
    console.log(`Server is listening on port http://localhost:${port}`);
});
