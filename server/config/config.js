import dotenv from "dotenv";

dotenv.config({ path: './config/.env' });


const dbURL = process.env.DB_CONNECTION_STRING;
const jwtSecret = process.env.JWT_SECRET;

if (!dbURL || !jwtSecret) {
    throw new Error("Missing enviroment variables")
};

export default {
    dbURL,
    jwtSecret
}