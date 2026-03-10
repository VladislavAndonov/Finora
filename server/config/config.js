if (process.env.NODE_ENV !== 'production') {
    await import('dotenv/config');
}

<<<<<<< HEAD
const config = {
    port: process.env.PORT || 3000,
    dbURL: process.env.DB_CONNECTION_STRING,
    jwtSecret: process.env.JWT_SECRET,
    clientOrigin: process.env.CLIENT_ORIGIN,
=======
dotenv.config({ path: './config/.env' });

const config = {
    dbURL: process.env.DB_CONNECTION_STRING,
    jwtSecret: process.env.JWT_SECRET,
>>>>>>> ui-improvements
    saltRounds: 10
};

export default config;