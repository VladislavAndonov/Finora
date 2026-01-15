import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const authMiddleware = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        console.log("we have token");
        return res.status(401).end();
    }

    try {
        const decodedToken = jwt.verify(token, config.jwtSecret);
        console.log(decodedToken);

        req.user = decodedToken;
        next();
    } catch (err) {
        res.status(401).end();
    }
}