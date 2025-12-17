import express from 'express'
import routes from ".routes.js"

const app = express();
const port = 3000;

app.use(routes);

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    next();
});


app.listen(port, () => {
    console.log(`Server is listening on port http://localhost:${port}`);
});
