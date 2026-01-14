import dotenv from "dotenv";

dotenv.config({ path: './config/.env' });


const dbURL = process.env.DB_CONNECTION_STRING;
const jwtSecret = process.env.JWT_SECRET;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

if (!dbURL || !jwtSecret || !jwtRefreshSecret) {
    throw new Error("Missing enviroment variables")
};

export default {
    dbURL,
    jwtSecret,
    jwtRefreshSecret
}